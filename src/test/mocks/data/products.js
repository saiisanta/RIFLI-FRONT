export const mockProducts = [
    {
      id: 1,
      name: 'Cámara Hikvision DS-2CD2043G0-I',
      description: 'Cámara IP 4MP Hikvision, lente 2.8 mm, IR 30 m, slot microSD.',
      imageUrl: '/api/images/Camaras.png',
      price: '79.99',
      categoria: 'Cámaras',
      marca: 'Hikvision',
      stock: 15
    },
    {
      id: 2,
      name: 'Cable UTP Cat5e 305m',
      description: 'Bobina de cable de red UTP Cat5e, 305 metros, ideal para LAN 1 Gbps.',
      imageUrl: '/api/images/Cables.png',
      price: '85.99',
      categoria: 'Cables',
      marca: 'Generic',
      stock: 50
    },
    {
      id: 3,
      name: 'DVR Dahua XVR5104HS',
      description: 'DVR 4 canales Dahua HDCVI/Analog/IP, HDMI, grabación 1080p.',
      imageUrl: '/api/images/DVR.png',
      price: '89.99',
      categoria: 'DVR',
      marca: 'Dahua',
      stock: 8
    },
    {
      id: 4,
      name: 'Taladro Inalámbrico 18V',
      description: 'Taladro a batería 18V con dos velocidades, batería 1.5Ah.',
      imageUrl: '/api/images/Herramientas.png',
      price: '55.00',
      categoria: 'Herramientas',
      marca: 'Black+Decker',
      stock: 12
    }
  ];
  
  export const mockProduct = mockProducts[0];
  
  export const mockProductFormData = {
    name: 'Producto Nuevo',
    description: 'Descripción del producto nuevo',
    price: '100.00',
    categoria: 'Cámaras',
    marca: 'Hikvision',
    stock: 10
  };