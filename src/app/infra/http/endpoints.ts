export const COLLABORATOR_ENDPOINTS = {
    getUsers: '/api/users/get-users',
    getUsersById: '/api/users/get-users-by-id',
    createComplete: '/api/users/create-complete',
    listUsersByPeriodProducts: '/api/products/list-users-by-period',
    listUsersByPeriod: '/api/users/list-users-by-period',
    update: '/api/users/update',
    delete: '/api/users/delete',
} as const;
