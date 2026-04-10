import React, { useState, useCallback, useRef } from 'react';
import useUsers from '../../../../hooks/useUsers';
import UserFilters from './components/UserFilters/UserFilters';
import UserTable from './components/UserTable/UserTable';
import UserForm from './components/UserForm/UserForm';
import Pagination from '../../components/Pagination/Pagination';
import './UserManager.scss';

const ITEMS_PER_PAGE = 10;
const DEBOUNCE_MS    = 450;

const UserManager = () => {
  const [search,          setSearch]          = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter,      setRoleFilter]      = useState('');
  const [verifiedFilter,  setVerifiedFilter]  = useState('');
  const [addressFilter,   setAddressFilter]   = useState('');
  const [debouncedAddress, setDebouncedAddress] = useState('');
  const [currentPage,     setCurrentPage]     = useState(1);
  const [roleModalUser,   setRoleModalUser]   = useState(null);

  const searchTimer  = useRef(null);
  const addressTimer = useRef(null);

  const {
    users,
    loading,
    error,
    pagination,
    changeRole,
    deleteUser,
    clearError,
  } = useUsers({
    page:        currentPage,
    limit:       ITEMS_PER_PAGE,
    search:      debouncedSearch,
    role:        roleFilter,
    is_verified: verifiedFilter,
    address:     debouncedAddress,
  });

  const handleSearchChange = (val) => {
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(val);
      setCurrentPage(1);
    }, DEBOUNCE_MS);
  };

  const handleAddressChange = (val) => {
    setAddressFilter(val);
    clearTimeout(addressTimer.current);
    addressTimer.current = setTimeout(() => {
      setDebouncedAddress(val);
      setCurrentPage(1);
    }, DEBOUNCE_MS);
  };

  const handleRoleFilterChange = (val) => {
    setRoleFilter(val);
    setCurrentPage(1);
  };

  const handleVerifiedFilterChange = (val) => {
    setVerifiedFilter(val);
    setCurrentPage(1);
  };

  const handleOpenRoleModal  = useCallback((user) => setRoleModalUser(user), []);
  const handleCloseRoleModal = useCallback(() => setRoleModalUser(null), []);

  const handleChangeRole = useCallback(async (userId, role) => {
    try {
      await changeRole(userId, role);
      handleCloseRoleModal();
    } catch (err) {
      console.error('Error al cambiar rol:', err);
    }
  }, [changeRole, handleCloseRoleModal]);

  const handleDelete = useCallback(async (userId, userName) => {
    if (!window.confirm(`¿Eliminar al usuario ${userName}? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteUser(userId);
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
    }
  }, [deleteUser]);

  if (loading && users.length === 0) {
    return (
      <div className="user-manager-loading">
        <div className="spinner" />
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="user-manager">
      <UserFilters
        total={pagination.total || users.length}
        search={search}
        onSearchChange={handleSearchChange}
        roleFilter={roleFilter}
        onRoleFilterChange={handleRoleFilterChange}
        verifiedFilter={verifiedFilter}
        onVerifiedFilterChange={handleVerifiedFilterChange}
        addressFilter={addressFilter}
        onAddressFilterChange={handleAddressChange}
        users={users}
        fetching={loading}
      />

      {error && (
        <div className="user-manager-error">
          {error}
          <button onClick={clearError}>✕</button>
        </div>
      )}

      <section className="user-manager-section">
        <div className="section-header">
          <h2>Usuarios registrados</h2>
          {loading && users.length > 0 && (
            <span className="user-manager-fetching">
              <span className="spinner-sm" /> Actualizando…
            </span>
          )}
        </div>
        <UserTable
          users={users}
          loading={loading}
          onChangeRole={handleOpenRoleModal}
          onDelete={handleDelete}
        />
        {pagination.total_pages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.total_pages}
            onPageChange={setCurrentPage}
          />
        )}
      </section>

      {roleModalUser && (
        <UserForm
          user={roleModalUser}
          onClose={handleCloseRoleModal}
          onSave={handleChangeRole}
          loading={loading}
        />
      )}
    </div>
  );
};

export default UserManager;