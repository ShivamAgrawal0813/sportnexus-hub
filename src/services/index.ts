// Re-export all the API functions from the mock-api
// This allows imports like: import { getVenues } from '@/services'
// And makes it easy to switch between mock and real API implementations

export * from './mock-api'; 