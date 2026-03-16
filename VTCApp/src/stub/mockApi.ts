/**
 * Mock API — simulates backend responses with realistic delays.
 * Replace with real API calls once the backend is ready.
 */

import {
  STUB_PASSENGER,
  STUB_DRIVER,
  STUB_NEARBY_DRIVERS,
  STUB_RIDE_HISTORY,
  STUB_DRIVER_RIDE_HISTORY,
  STUB_FINANCIAL,
  STUB_INCOMING_RIDE,
  VEHICLE_CATEGORIES,
  type User,
  type Driver,
  type RideRequest,
  type VehicleCategory,
} from './data';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const mockLogin = async (
  email: string,
  _password: string,
  role: 'passenger' | 'driver'
): Promise<User | Driver> => {
  await delay(800);
  if (role === 'passenger') return STUB_PASSENGER;
  return STUB_DRIVER;
};

export const mockRegister = async (_data: unknown): Promise<{ success: true }> => {
  await delay(1200);
  return { success: true };
};

export const mockVerifyOTP = async (_code: string): Promise<{ success: true }> => {
  await delay(600);
  return { success: true };
};

// ─── Geo & Search ─────────────────────────────────────────────────────────────

export const mockSearchAddress = async (query: string): Promise<string[]> => {
  await delay(400);
  const base = [
    `${query} — 1 Rue de la Paix, Paris 75002`,
    `${query} — 14 Boulevard Haussmann, Paris 75009`,
    `${query} — Gare Saint-Lazare, Paris 75008`,
    `${query} — Tour Eiffel, Paris 75007`,
  ];
  return base.slice(0, 3);
};

export const mockGetNearbyDrivers = async (): Promise<Driver[]> => {
  await delay(500);
  return STUB_NEARBY_DRIVERS;
};

// ─── Booking ─────────────────────────────────────────────────────────────────

export const mockEstimatePrice = async (
  _pickup: string,
  _dropoff: string,
  category: VehicleCategory
): Promise<{ price: number; duration: number; distance: number }> => {
  await delay(700);
  const cat = VEHICLE_CATEGORIES.find((c) => c.category === category)!;
  const distance = 4 + Math.random() * 20;
  const duration = Math.round((distance / 30) * 60 + 5);
  const price = +(cat.basePrice + distance * cat.pricePerKm + duration * cat.pricePerMin).toFixed(2);
  return { price, duration, distance: +distance.toFixed(1) };
};

export const mockBookRide = async (_data: Partial<RideRequest>): Promise<RideRequest> => {
  await delay(1000);
  return { ...STUB_INCOMING_RIDE, id: `r-${Date.now()}`, status: 'searching' };
};

// ─── Ride History ─────────────────────────────────────────────────────────────

export const mockGetPassengerHistory = async (): Promise<RideRequest[]> => {
  await delay(600);
  return STUB_RIDE_HISTORY;
};

export const mockGetDriverHistory = async () => {
  await delay(600);
  return STUB_DRIVER_RIDE_HISTORY;
};

export const mockGetDriverFinancials = async () => {
  await delay(500);
  return STUB_FINANCIAL;
};

// ─── Driver Actions ───────────────────────────────────────────────────────────

export const mockAcceptRide = async (_rideId: string): Promise<{ success: true }> => {
  await delay(400);
  return { success: true };
};

export const mockDeclineRide = async (_rideId: string): Promise<{ success: true }> => {
  await delay(300);
  return { success: true };
};

export const mockUpdateRideStatus = async (
  _rideId: string,
  _status: string
): Promise<{ success: true }> => {
  await delay(400);
  return { success: true };
};

export const mockToggleOnline = async (online: boolean): Promise<{ isOnline: boolean }> => {
  await delay(300);
  return { isOnline: online };
};

// ─── Ratings ─────────────────────────────────────────────────────────────────

export const mockSubmitRating = async (
  _driverId: string,
  _rating: number,
  _comment?: string
): Promise<{ success: true }> => {
  await delay(500);
  return { success: true };
};
