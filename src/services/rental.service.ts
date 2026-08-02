import api from "@/lib/axios";
import type {
  ApiResponse,
  CreateRentalData,
  Rental,
  UpdateRentalStatusData,
} from "@/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractMessage(payload: unknown, fallback: string): string {
  if (isRecord(payload) && typeof payload.message === "string" && payload.message) {
    return payload.message;
  }
  return fallback;
}

function extractRental(payload: unknown): Rental | null {
  if (!isRecord(payload)) return null;

  if (
    (typeof payload.id === "string" || typeof payload._id === "string") &&
    (typeof payload.propertyId === "string" ||
      typeof payload.property_id === "string" ||
      isRecord(payload.property) ||
      isRecord(payload.properties))
  ) {
    return normalizeRental(payload);
  }

  if ("data" in payload) {
    return extractRental(payload.data);
  }

  if (isRecord(payload.rental)) {
    return extractRental(payload.rental);
  }

  return null;
}

function extractRentals(payload: unknown): Rental[] {
  if (Array.isArray(payload)) {
    return payload
      .map((item) => extractRental(item))
      .filter((item): item is Rental => item !== null);
  }

  if (!isRecord(payload)) return [];

  if (Array.isArray(payload.data)) {
    return extractRentals(payload.data);
  }

  if (isRecord(payload.data)) {
    if (Array.isArray(payload.data.items)) return extractRentals(payload.data.items);
    if (Array.isArray(payload.data.rentals)) return extractRentals(payload.data.rentals);
    if (Array.isArray(payload.data.requests)) return extractRentals(payload.data.requests);
  }

  if (Array.isArray(payload.rentals)) return extractRentals(payload.rentals);
  if (Array.isArray(payload.requests)) return extractRentals(payload.requests);

  return [];
}

function normalizeRental(raw: Record<string, unknown>): Rental {
  const id = String(raw.id ?? raw._id ?? "");
  const propertyRaw = isRecord(raw.property)
    ? raw.property
    : isRecord(raw.properties)
      ? raw.properties
      : undefined;

  const propertyId = String(
    raw.propertyId ?? raw.property_id ?? (propertyRaw ? propertyRaw.id : "")
  );
  const tenantId = String(
    raw.tenantId ?? raw.tenant_id ?? (isRecord(raw.tenant) ? raw.tenant.id : "")
  );

  const moveInDate = String(
    raw.moveInDate ?? raw.move_in_date ?? raw.startDate ?? raw.start_date ?? ""
  );

  return {
    id,
    propertyId,
    tenantId,
    moveInDate: moveInDate || undefined,
    startDate: moveInDate || undefined,
    endDate: typeof raw.endDate === "string" ? raw.endDate : undefined,
    status: (raw.status as Rental["status"]) || "PENDING",
    message:
      typeof raw.message === "string"
        ? raw.message
        : typeof raw.note === "string"
          ? raw.note
          : undefined,
    property: propertyRaw
      ? (propertyRaw as unknown as Rental["property"])
      : undefined,
    tenant: isRecord(raw.tenant) ? (raw.tenant as unknown as Rental["tenant"]) : undefined,
    payment: isRecord(raw.payment) ? (raw.payment as unknown as Rental["payment"]) : undefined,
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : undefined,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : undefined,
  };
}

function toCreatePayload(rentalData: CreateRentalData) {
  const moveIn = rentalData.moveInDate.includes("T")
    ? rentalData.moveInDate
    : new Date(`${rentalData.moveInDate}T12:00:00.000Z`).toISOString();

  const payload: Record<string, unknown> = {
    propertyId: rentalData.propertyId,
    moveInDate: moveIn,
  };

  if (rentalData.message?.trim()) {
    payload.message = rentalData.message.trim();
  }

  return payload;
}

export const rentalService = {
  getAll: async (): Promise<Rental[]> => {
    const { data } = await api.get<ApiResponse<Rental[]> | Rental[]>("/rentals");
    return extractRentals(data);
  },

  getById: async (id: string): Promise<Rental> => {
    const { data } = await api.get<ApiResponse<Rental> | Rental>(`/rentals/${id}`);
    const rental = extractRental(data);
    if (!rental) throw new Error(extractMessage(data, "Rental not found"));
    return rental;
  },

  create: async (rentalData: CreateRentalData): Promise<Rental> => {
    const { data } = await api.post<unknown>("/rentals", toCreatePayload(rentalData));
    const rental = extractRental(data);

    if (!rental) {
      if (isRecord(data) && data.success === false) {
        throw new Error(extractMessage(data, "Failed to create rental request"));
      }
      if (isRecord(data) && (data.success === true || typeof data.message === "string")) {
        return {
          id: typeof data.id === "string" ? data.id : `temp-${Date.now()}`,
          propertyId: rentalData.propertyId,
          tenantId: "",
          moveInDate: rentalData.moveInDate,
          startDate: rentalData.moveInDate,
          status: "PENDING",
          message: rentalData.message,
        };
      }
      throw new Error(extractMessage(data, "Failed to create rental request"));
    }

    return rental;
  },

  getLandlordRequests: async (): Promise<Rental[]> => {
    const { data } = await api.get<ApiResponse<Rental[]> | Rental[]>("/landlord/requests");
    return extractRentals(data);
  },

  updateStatus: async (
    id: string,
    statusData: UpdateRentalStatusData
  ): Promise<Rental> => {
    const { data } = await api.patch<unknown>(`/landlord/requests/${id}`, statusData);
    const rental = extractRental(data);
    if (!rental) {
      if (isRecord(data) && data.success === false) {
        throw new Error(extractMessage(data, "Failed to update request"));
      }
      return {
        id,
        propertyId: "",
        tenantId: "",
        status: statusData.status,
      };
    }
    return rental;
  },
};
