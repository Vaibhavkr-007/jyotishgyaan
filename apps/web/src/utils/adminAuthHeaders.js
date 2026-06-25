export const getAdminToken = () => {
    return localStorage.getItem(
        'adminToken'
    );
};

export const getAdminAuthHeaders = () => {
    const token = getAdminToken();

    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};