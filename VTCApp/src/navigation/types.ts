// ─── Navigation type definitions ─────────────────────────────────────────────

export type AuthStackParamList = {
  Welcome: undefined;
  Login: { role: 'passenger' | 'driver' };
  Register: { role: 'passenger' | 'driver' };
  OTP: { phone: string; role: 'passenger' | 'driver' };
};

export type PassengerStackParamList = {
  Booking: { pickup: string; dropoff: string; favoriteDriverId?: string };
  Disposition: undefined;
  BookForOther: undefined;
  FavoriteDrivers: undefined;
  Tracking: { rideId: string };
  Rating: { rideId: string; driverId: string; driverName: string };
  Profile: undefined;
};

export type PassengerTabParamList = {
  PassengerHome: undefined;
  History: undefined;
  PassengerStack: undefined;
  Profile: undefined;
};

export type DriverStackParamList = {
  ActiveRide: { rideId: string };
};

export type DriverTabParamList = {
  DriverHome: undefined;
  Dashboard: undefined;
  DriverStack: undefined;
  DriverProfile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Passenger: undefined;
  Driver: undefined;
};
