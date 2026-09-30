const SERVICE_PRIORITY_REGIONS = {
  'floor-wax': ['gunpo', 'ansan', 'anyang', 'suwon', 'uiwang'],
};

export function getPriorityRegionsForService(serviceId) {
  return SERVICE_PRIORITY_REGIONS[serviceId] || [];
}
