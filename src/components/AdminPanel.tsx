import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  AdminPanelSettings,
  People,
  LocalShipping,
  Inventory,
  Security,
  LocationOn,
  History,
  Edit,
  Delete,
  Block,
  CheckCircle,
  Cancel,
  Refresh,
  Add,
  Search,
  FilterList,
  Visibility,
} from '@mui/icons-material';
import { adminService, AdminUser, IPBlacklistItem, GeoLocation, ActivityLog } from '../services/adminService';
import { useAuth } from '../contexts/AuthContext';
import { testApiConnection, testAuthToken, testAdminEndpoint } from '../utils/apiTest';
import { config } from '../config/environment';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Users state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersPage, setUsersPage] = useState(0);
  const [usersRowsPerPage, setUsersRowsPerPage] = useState(10);
  const [usersTotal, setUsersTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);

  // Cargo state
  const [cargos, setCargos] = useState<any[]>([]);
  const [cargosPage, setCargosPage] = useState(0);
  const [cargosRowsPerPage, setCargosRowsPerPage] = useState(10);
  const [cargosTotal, setCargosTotal] = useState(0);

  // Transport state
  const [transports, setTransports] = useState<any[]>([]);
  const [transportsPage, setTransportsPage] = useState(0);
  const [transportsRowsPerPage, setTransportsRowsPerPage] = useState(10);
  const [transportsTotal, setTransportsTotal] = useState(0);

  // IP Blacklist state
  const [ipBlacklist, setIpBlacklist] = useState<IPBlacklistItem[]>([]);
  const [ipBlacklistPage, setIpBlacklistPage] = useState(0);
  const [ipBlacklistRowsPerPage, setIpBlacklistRowsPerPage] = useState(10);
  const [ipBlacklistTotal, setIpBlacklistTotal] = useState(0);
  const [ipBlacklistDialogOpen, setIpBlacklistDialogOpen] = useState(false);

  // Geo Locations state
  const [geoLocations, setGeoLocations] = useState<GeoLocation[]>([]);
  const [geoLocationsPage, setGeoLocationsPage] = useState(0);
  const [geoLocationsRowsPerPage, setGeoLocationsRowsPerPage] = useState(10);
  const [geoLocationsTotal, setGeoLocationsTotal] = useState(0);
  const [geoLocationDialogOpen, setGeoLocationDialogOpen] = useState(false);

  // Activity Logs state
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [activityLogsPage, setActivityLogsPage] = useState(0);
  const [activityLogsRowsPerPage, setActivityLogsRowsPerPage] = useState(10);
  const [activityLogsTotal, setActivityLogsTotal] = useState(0);

  // Check if user is admin
  useEffect(() => {
    if (user && !user.is_admin) {
      setError('Доступ запрещен. Требуются права администратора.');
    }
  }, [user]);

  // Load data based on current tab
  useEffect(() => {
    console.log('=== AdminPanel useEffect triggered ===');
    console.log('Current tab:', currentTab);
    console.log('User:', user);
    console.log('User is_admin:', user?.is_admin);
    console.log('User authenticated:', !!user);
    
    if (user?.is_admin) {
      console.log('User is admin, loading tab data...');
      loadTabData();
    } else {
      console.log('User is not admin or not authenticated, skipping data load');
      if (user && !user.is_admin) {
        console.log('User exists but is not admin');
      } else if (!user) {
        console.log('No user found');
      }
    }
  }, [currentTab, user]);

  const loadTabData = async () => {
    console.log('=== loadTabData called ===');
    console.log('Current tab:', currentTab);
    console.log('User:', user);
    setLoading(true);
    setError(null);
    
    try {
      switch (currentTab) {
        case 0: // Users
          console.log('Loading users...');
          await loadUsers();
          break;
        case 1: // Cargo
          console.log('Loading cargos...');
          await loadCargos();
          break;
        case 2: // Transport
          console.log('Loading transports...');
          await loadTransports();
          break;
        case 3: // IP Blacklist
          console.log('Loading IP blacklist...');
          await loadIPBlacklist();
          break;
        case 4: // Geo Locations
          console.log('Loading geo locations...');
          await loadGeoLocations();
          break;
        case 5: // Activity Logs
          console.log('Loading activity logs...');
          await loadActivityLogs();
          break;
      }
    } catch (err: any) {
      console.error('Error in loadTabData:', err);
      setError(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      console.log('=== LOAD USERS DEBUG ===');
      console.log('Current user for admin check:', user);
      console.log('User is_admin:', user?.is_admin);
      console.log('Access token exists:', !!localStorage.getItem('accessToken'));
      console.log('Access token:', localStorage.getItem('accessToken')?.slice(0, 20) + '...');
      console.log('API Base URL:', config.apiBaseUrl);
      
      const requestParams = {
        page: usersPage + 1,
        limit: usersRowsPerPage,
      };
      console.log('Request params:', requestParams);
      
      const response = await adminService.getUsersList(requestParams);
      
      console.log('Users API response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      console.log('Response message:', response.message);
      console.log('Response error:', response.error);
      
      if (response.status && response.data) {
        console.log('Setting users:', response.data.users || []);
        console.log('Setting total:', response.data.total || 0);
        setUsers(response.data.users || []);
        setUsersTotal(response.data.total || 0);
      } else {
        console.error('Failed to load users - response not successful:', response);
        setUsers([]);
        setUsersTotal(0);
        setError(`Не удалось загрузить список пользователей: ${response.message || response.error || 'Неизвестная ошибка'}`);
      }
    } catch (err: any) {
      console.error('Error loading users - exception caught:', err);
      console.error('Error message:', err.message);
      console.error('Error status:', err.statusCode);
      setUsers([]);
      setUsersTotal(0);
      setError(err.message || 'Ошибка загрузки пользователей');
    }
  };

  const loadCargos = async () => {
    try {
      const response = await adminService.getCargoList({
        page: cargosPage + 1,
        limit: cargosRowsPerPage,
      });
      
      console.log('Cargos API response:', response);
      
      if (response.status && response.data) {
        setCargos(response.data.data || []);
        setCargosTotal(response.data.total || 0);
      } else {
        console.error('Failed to load cargos:', response);
        setCargos([]);
        setCargosTotal(0);
        setError('Не удалось загрузить список грузов');
      }
    } catch (err: any) {
      console.error('Error loading cargos:', err);
      setCargos([]);
      setCargosTotal(0);
      setError(err.message || 'Ошибка загрузки грузов');
    }
  };

  const loadTransports = async () => {
    try {
      const response = await adminService.getTransportList({
        page: transportsPage + 1,
        limit: transportsRowsPerPage,
      });
      
      console.log('Transports API response:', response);
      
      if (response.status && response.data) {
        setTransports(response.data.data || []);
        setTransportsTotal(response.data.total || 0);
      } else {
        console.error('Failed to load transports:', response);
        setTransports([]);
        setTransportsTotal(0);
        setError('Не удалось загрузить список транспорта');
      }
    } catch (err: any) {
      console.error('Error loading transports:', err);
      setTransports([]);
      setTransportsTotal(0);
      setError(err.message || 'Ошибка загрузки транспорта');
    }
  };

  const loadIPBlacklist = async () => {
    try {
      const response = await adminService.getIPBlacklist({
        page: ipBlacklistPage + 1,
        limit: ipBlacklistRowsPerPage,
      });
      
      console.log('IP Blacklist API response:', response);
      
      if (response.status && response.data) {
        setIpBlacklist(response.data.items || []);
        setIpBlacklistTotal(response.data.total || 0);
      } else {
        console.error('Failed to load IP blacklist:', response);
        setIpBlacklist([]);
        setIpBlacklistTotal(0);
        setError('Не удалось загрузить IP blacklist');
      }
    } catch (err: any) {
      console.error('Error loading IP blacklist:', err);
      setIpBlacklist([]);
      setIpBlacklistTotal(0);
      setError(err.message || 'Ошибка загрузки IP blacklist');
    }
  };

  const loadGeoLocations = async () => {
    try {
      const response = await adminService.getGeoLocations({
        page: geoLocationsPage + 1,
        limit: geoLocationsRowsPerPage,
      });
      
      console.log('Geo Locations API response:', response);
      
      if (response.status && response.data) {
        setGeoLocations(response.data.locations || []);
        setGeoLocationsTotal(response.data.total || 0);
      } else {
        console.error('Failed to load geo locations:', response);
        setGeoLocations([]);
        setGeoLocationsTotal(0);
        setError('Не удалось загрузить геолокации');
      }
    } catch (err: any) {
      console.error('Error loading geo locations:', err);
      setGeoLocations([]);
      setGeoLocationsTotal(0);
      setError(err.message || 'Ошибка загрузки геолокаций');
    }
  };

  const loadActivityLogs = async () => {
    try {
      const response = await adminService.getActivityLogs({
        page: activityLogsPage + 1,
        limit: activityLogsRowsPerPage,
      });
      
      console.log('Activity Logs API response:', response);
      
      if (response.status && response.data) {
        setActivityLogs(response.data.logs || []);
        setActivityLogsTotal(response.data.total || 0);
      } else {
        console.error('Failed to load activity logs:', response);
        setActivityLogs([]);
        setActivityLogsTotal(0);
        setError('Не удалось загрузить логи активности');
      }
    } catch (err: any) {
      console.error('Error loading activity logs:', err);
      setActivityLogs([]);
      setActivityLogsTotal(0);
      setError(err.message || 'Ошибка загрузки логов активности');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleUserEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  const handleUserUpdate = async (updatedUser: AdminUser) => {
    try {
      setLoading(true);
      const response = await adminService.updateUser(updatedUser.id, {
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        is_admin: updatedUser.is_admin,
        status: updatedUser.status,
        meta: updatedUser.meta,
      });

      if (response.status) {
        setSuccess('Пользователь успешно обновлен');
        await loadUsers();
        setUserDialogOpen(false);
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка обновления пользователя');
    } finally {
      setLoading(false);
    }
  };

  const handleUserBan = async (userId: string) => {
    try {
      setLoading(true);
      const response = await adminService.banUser(userId);
      
      if (response.status) {
        setSuccess('Пользователь заблокирован');
        await loadUsers();
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка блокировки пользователя');
    } finally {
      setLoading(false);
    }
  };

  const handleUserDelete = async (userId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        setLoading(true);
        const response = await adminService.deleteUser(userId);
        
        if (response.status) {
          setSuccess('Пользователь удален');
          await loadUsers();
        }
      } catch (err: any) {
        setError(err.message || 'Ошибка удаления пользователя');
      } finally {
        setLoading(false);
      }
    }
  };

  const runApiTests = async () => {
    console.log('=== RUNNING API TESTS ===');
    
    // Тест токена
    testAuthToken();
    
    // Тест соединения
    const connectionTest = await testApiConnection();
    console.log('Connection test result:', connectionTest);
    
    // Тест админского endpoint
    const adminTest = await testAdminEndpoint();
    console.log('Admin test result:', adminTest);
    
    // Обновляем данные пользователей после тестов
    if (adminTest.success) {
      setSuccess('API тесты прошли успешно');
      await loadUsers();
    } else {
      setError(`API тест не прошел: ${adminTest.error}`);
    }
  };

  const handleCargoDelete = async (cargoId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот груз?')) {
      try {
        setLoading(true);
        const response = await adminService.deleteCargo(cargoId);
        
        if (response.status) {
          setSuccess('Груз удален');
          await loadCargos();
        }
      } catch (err: any) {
        setError(err.message || 'Ошибка удаления груза');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTransportDelete = async (transportId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот транспорт?')) {
      try {
        setLoading(true);
        const response = await adminService.deleteTransport(transportId);
        
        if (response.status) {
          setSuccess('Транспорт удален');
          await loadTransports();
        }
      } catch (err: any) {
        setError(err.message || 'Ошибка удаления транспорта');
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'warning';
      case 'BANNED': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Активен';
      case 'INACTIVE': return 'Неактивен';
      case 'BANNED': return 'Заблокирован';
      default: return status;
    }
  };

  if (!user?.is_admin) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Доступ запрещен. Требуются права администратора.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      <Paper sx={{ mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            <AdminPanelSettings sx={{ mr: 1, verticalAlign: 'middle' }} />
            Панель администратора
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          )}

          <Tabs value={currentTab} onChange={handleTabChange} variant="scrollable">
            <Tab 
              icon={<People />} 
              label="Пользователи" 
              iconPosition="start"
            />
            <Tab 
              icon={<Inventory />} 
              label="Грузы" 
              iconPosition="start"
            />
            <Tab 
              icon={<LocalShipping />} 
              label="Транспорт" 
              iconPosition="start"
            />
            <Tab 
              icon={<Security />} 
              label="IP Blacklist" 
              iconPosition="start"
            />
            <Tab 
              icon={<LocationOn />} 
              label="Геолокации" 
              iconPosition="start"
            />
            <Tab 
              icon={<History />} 
              label="Логи активности" 
              iconPosition="start"
            />
          </Tabs>
        </Box>
      </Paper>

      {/* Users Tab */}
      <TabPanel value={currentTab} index={0}>
        <Paper>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Управление пользователями</Typography>
            <Box>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadUsers}
                disabled={loading}
                sx={{ mr: 1 }}
              >
                Обновить
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={runApiTests}
                disabled={loading}
              >
                Тест API
              </Button>
            </Box>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Телефон</TableCell>
                      <TableCell>Имя</TableCell>
                      <TableCell>Статус</TableCell>
                      <TableCell>Админ</TableCell>
                      <TableCell>Дата регистрации</TableCell>
                      <TableCell>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(users || []).map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id.slice(0, 8)}...</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          {user.first_name} {user.last_name}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getStatusLabel(user.status)} 
                            color={getStatusColor(user.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.is_admin ? 'Да' : 'Нет'} 
                            color={user.is_admin ? 'primary' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Редактировать">
                            <IconButton 
                              size="small" 
                              onClick={() => handleUserEdit(user)}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Заблокировать">
                            <IconButton 
                              size="small" 
                              color="warning"
                              onClick={() => handleUserBan(user.id)}
                            >
                              <Block />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Удалить">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleUserDelete(user.id)}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                component="div"
                count={usersTotal}
                page={usersPage}
                onPageChange={(event, newPage) => setUsersPage(newPage)}
                rowsPerPage={usersRowsPerPage}
                onRowsPerPageChange={(event) => {
                  setUsersRowsPerPage(parseInt(event.target.value, 10));
                  setUsersPage(0);
                }}
                labelRowsPerPage="Строк на странице:"
                labelDisplayedRows={({ from, to, count }) => 
                  `${from}-${to} из ${count !== -1 ? count : `более ${to}`}`
                }
              />
            </>
          )}
        </Paper>
      </TabPanel>

      {/* Cargo Tab */}
      <TabPanel value={currentTab} index={1}>
        <Paper>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Управление грузами</Typography>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadCargos}
              disabled={loading}
            >
              Обновить
            </Button>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Пользователь</TableCell>
                      <TableCell>Описание</TableCell>
                      <TableCell>Вес</TableCell>
                      <TableCell>Объем</TableCell>
                      <TableCell>Дата создания</TableCell>
                      <TableCell>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(cargos || []).map((cargo) => (
                      <TableRow key={cargo.id}>
                        <TableCell>{cargo.id.slice(0, 8)}...</TableCell>
                        <TableCell>{cargo.user?.phone || 'N/A'}</TableCell>
                        <TableCell>{cargo.description || 'N/A'}</TableCell>
                        <TableCell>{cargo.weight_t} т</TableCell>
                        <TableCell>{cargo.volume_m3} м³</TableCell>
                        <TableCell>
                          {new Date(cargo.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Удалить">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleCargoDelete(cargo.id)}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                component="div"
                count={cargosTotal}
                page={cargosPage}
                onPageChange={(event, newPage) => setCargosPage(newPage)}
                rowsPerPage={cargosRowsPerPage}
                onRowsPerPageChange={(event) => {
                  setCargosRowsPerPage(parseInt(event.target.value, 10));
                  setCargosPage(0);
                }}
                labelRowsPerPage="Строк на странице:"
                labelDisplayedRows={({ from, to, count }) => 
                  `${from}-${to} из ${count !== -1 ? count : `более ${to}`}`
                }
              />
            </>
          )}
        </Paper>
      </TabPanel>

      {/* Transport Tab */}
      <TabPanel value={currentTab} index={2}>
        <Paper>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Управление транспортом</Typography>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadTransports}
              disabled={loading}
            >
              Обновить
            </Button>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Пользователь</TableCell>
                      <TableCell>Тип транспорта</TableCell>
                      <TableCell>Количество машин</TableCell>
                      <TableCell>Вес</TableCell>
                      <TableCell>Объем</TableCell>
                      <TableCell>Дата создания</TableCell>
                      <TableCell>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(transports || []).map((transport) => (
                      <TableRow key={transport.id}>
                        <TableCell>{transport.id.slice(0, 8)}...</TableCell>
                        <TableCell>{transport.user?.phone || 'N/A'}</TableCell>
                        <TableCell>{transport.vehicle_type}</TableCell>
                        <TableCell>{transport.cars_count}</TableCell>
                        <TableCell>{transport.weight_t} т</TableCell>
                        <TableCell>{transport.volume_m3} м³</TableCell>
                        <TableCell>
                          {new Date(transport.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Удалить">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleTransportDelete(transport.id)}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                component="div"
                count={transportsTotal}
                page={transportsPage}
                onPageChange={(event, newPage) => setTransportsPage(newPage)}
                rowsPerPage={transportsRowsPerPage}
                onRowsPerPageChange={(event) => {
                  setTransportsRowsPerPage(parseInt(event.target.value, 10));
                  setTransportsPage(0);
                }}
                labelRowsPerPage="Строк на странице:"
                labelDisplayedRows={({ from, to, count }) => 
                  `${from}-${to} из ${count !== -1 ? count : `более ${to}`}`
                }
              />
            </>
          )}
        </Paper>
      </TabPanel>

      {/* IP Blacklist Tab */}
      <TabPanel value={currentTab} index={3}>
        <Paper>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">IP Blacklist</Typography>
            <Box>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setIpBlacklistDialogOpen(true)}
                sx={{ mr: 1 }}
              >
                Добавить IP
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadIPBlacklist}
                disabled={loading}
              >
                Обновить
              </Button>
            </Box>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>IP Адрес</TableCell>
                      <TableCell>Причина</TableCell>
                      <TableCell>Дата добавления</TableCell>
                      <TableCell>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(ipBlacklist || []).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.ip_address}</TableCell>
                        <TableCell>{item.reason || 'Не указана'}</TableCell>
                        <TableCell>
                          {new Date(item.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Удалить">
                            <IconButton 
                              size="small" 
                              color="error"
                      onClick={() => {
                                if (window.confirm('Удалить IP из blacklist?')) {
                                  adminService.deleteIPBlacklist(item.id).then(() => {
                                    setSuccess('IP удален из blacklist');
                                    loadIPBlacklist();
                                  }).catch((err) => setError(err.message));
                                }
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                component="div"
                count={ipBlacklistTotal}
                page={ipBlacklistPage}
                onPageChange={(event, newPage) => setIpBlacklistPage(newPage)}
                rowsPerPage={ipBlacklistRowsPerPage}
                onRowsPerPageChange={(event) => {
                  setIpBlacklistRowsPerPage(parseInt(event.target.value, 10));
                  setIpBlacklistPage(0);
                }}
                labelRowsPerPage="Строк на странице:"
                labelDisplayedRows={({ from, to, count }) => 
                  `${from}-${to} из ${count !== -1 ? count : `более ${to}`}`
                }
              />
            </>
          )}
        </Paper>
      </TabPanel>

      {/* Geo Locations Tab */}
      <TabPanel value={currentTab} index={4}>
        <Paper>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Геолокации</Typography>
            <Box>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setGeoLocationDialogOpen(true)}
                sx={{ mr: 1 }}
              >
                Добавить локацию
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadGeoLocations}
                disabled={loading}
              >
                Обновить
              </Button>
            </Box>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Тип</TableCell>
                      <TableCell>Название</TableCell>
                      <TableCell>Код</TableCell>
                      <TableCell>ISO2</TableCell>
                      <TableCell>Slug</TableCell>
                      <TableCell>Активна</TableCell>
                      <TableCell>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(geoLocations || []).map((location) => (
                      <TableRow key={location.id}>
                        <TableCell>
                          <Chip 
                            label={location.type} 
                            color={location.type === 'COUNTRY' ? 'primary' : location.type === 'REGION' ? 'secondary' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{location.name}</TableCell>
                        <TableCell>{location.code}</TableCell>
                        <TableCell>{location.iso2 || 'N/A'}</TableCell>
                        <TableCell>{location.slug}</TableCell>
                        <TableCell>
                          <Chip 
                            label={location.is_active ? 'Да' : 'Нет'} 
                            color={location.is_active ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Удалить">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => {
                                if (window.confirm('Удалить геолокацию?')) {
                                  adminService.deleteGeoLocation(location.id).then(() => {
                                    setSuccess('Геолокация удалена');
                                    loadGeoLocations();
                                  }).catch((err) => setError(err.message));
                                }
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                component="div"
                count={geoLocationsTotal}
                page={geoLocationsPage}
                onPageChange={(event, newPage) => setGeoLocationsPage(newPage)}
                rowsPerPage={geoLocationsRowsPerPage}
                onRowsPerPageChange={(event) => {
                  setGeoLocationsRowsPerPage(parseInt(event.target.value, 10));
                  setGeoLocationsPage(0);
                }}
                labelRowsPerPage="Строк на странице:"
                labelDisplayedRows={({ from, to, count }) => 
                  `${from}-${to} из ${count !== -1 ? count : `более ${to}`}`
                }
              />
            </>
          )}
        </Paper>
      </TabPanel>

      {/* Activity Logs Tab */}
      <TabPanel value={currentTab} index={5}>
        <Paper>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Логи активности</Typography>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadActivityLogs}
              disabled={loading}
            >
              Обновить
            </Button>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Пользователь</TableCell>
                      <TableCell>Действие</TableCell>
                      <TableCell>Тип ресурса</TableCell>
                      <TableCell>ID ресурса</TableCell>
                      <TableCell>IP Адрес</TableCell>
                      <TableCell>Дата</TableCell>
                      <TableCell>Детали</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(activityLogs || []).map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.user_id.slice(0, 8)}...</TableCell>
                        <TableCell>
                          <Chip 
                            label={log.action} 
                            color="primary"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{log.resource_type}</TableCell>
                        <TableCell>{log.resource_id.slice(0, 8)}...</TableCell>
                        <TableCell>{log.ip_address}</TableCell>
                        <TableCell>
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Показать детали">
                            <IconButton 
                              size="small"
                              onClick={() => {
                                alert(JSON.stringify(log.details, null, 2));
                              }}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                component="div"
                count={activityLogsTotal}
                page={activityLogsPage}
                onPageChange={(event, newPage) => setActivityLogsPage(newPage)}
                rowsPerPage={activityLogsRowsPerPage}
                onRowsPerPageChange={(event) => {
                  setActivityLogsRowsPerPage(parseInt(event.target.value, 10));
                  setActivityLogsPage(0);
                }}
                labelRowsPerPage="Строк на странице:"
                labelDisplayedRows={({ from, to, count }) => 
                  `${from}-${to} из ${count !== -1 ? count : `более ${to}`}`
                }
              />
            </>
          )}
        </Paper>
      </TabPanel>

      {/* User Edit Dialog */}
      <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Редактировать пользователя</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Имя"
                  value={selectedUser.first_name || ''}
                  onChange={(e) => setSelectedUser({...selectedUser, first_name: e.target.value})}
                />
                <TextField
                  fullWidth
                  label="Фамилия"
                  value={selectedUser.last_name || ''}
                  onChange={(e) => setSelectedUser({...selectedUser, last_name: e.target.value})}
                />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Email"
                  value={selectedUser.email || ''}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                />
                <FormControl fullWidth>
                  <InputLabel>Статус</InputLabel>
                  <Select
                    value={selectedUser.status}
                    onChange={(e) => setSelectedUser({...selectedUser, status: e.target.value as any})}
                  >
                    <MenuItem value="ACTIVE">Активен</MenuItem>
                    <MenuItem value="INACTIVE">Неактивен</MenuItem>
                    <MenuItem value="BANNED">Заблокирован</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedUser.is_admin}
                      onChange={(e) => setSelectedUser({...selectedUser, is_admin: e.target.checked})}
                    />
                  }
                  label="Администратор"
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)}>Отмена</Button>
          <Button 
            onClick={() => selectedUser && handleUserUpdate(selectedUser)}
            variant="contained"
            disabled={loading}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPanel;