import { VehicleType } from '../types/vehicle';

export const vehicleTypes: VehicleType[] = [
  {
    id: 'bus',
    name: 'Ônibus',
    icon: '🚌',
    categories: [
      {
        id: 'highway',
        name: 'Rodoviário',
        subcategories: [
          { id: 'highway-conventional', name: 'Convencional', description: 'Ônibus rodoviário padrão' },
          { id: 'double-deck', name: 'DD (Double Deck)', description: 'Ônibus de dois andares' },
          { id: 'low-driver', name: 'LD (Low Driver)', description: 'Ônibus com motorista em posição baixa' },
          { id: 'midi-highway', name: 'Midi Rodoviário', description: 'Ônibus de tamanho médio' },
          { id: 'micro-highway', name: 'Micro Rodoviário', description: 'Ônibus pequeno para viagens' }
        ]
      },
      {
        id: 'urban',
        name: 'Urbano',
        subcategories: [
          { id: 'bi-articulated', name: 'Biarticulado', description: 'Três seções, capacidade máxima' },
          { id: 'articulated', name: 'Articulado', description: 'Duas seções conectadas' },
          { id: 'padron', name: 'Padrão', description: 'Até 14m, até 80 passageiros' },
          { id: 'midi-urban', name: 'Midi', description: 'Intermediário entre micro e padrão' },
          { id: 'basic', name: 'Básico', description: 'Tradicional urbano' },
          { id: 'micro-urban', name: 'Micro', description: 'Menor capacidade' }
        ]
      },
      {
        id: 'school',
        name: 'Escolar',
        subcategories: [
          { id: 'school-standard', name: 'Padrão', description: 'Ônibus escolar convencional' },
          { id: 'school-midi', name: 'Midi Escolar', description: 'Ônibus escolar médio' },
          { id: 'school-micro', name: 'Micro Escolar', description: 'Ônibus escolar pequeno' },
          { id: 'school-van', name: 'Van Escolar', description: 'Van adaptada para transporte escolar' }
        ]
      },
      {
        id: 'rural',
        name: 'Rural',
        subcategories: [
          { id: 'rural-standard', name: 'Padrão', description: 'Ônibus rural convencional' },
          { id: 'rural-reinforced', name: 'Reforçado', description: 'Ônibus rural com suspensão reforçada' },
          { id: 'rural-4x4', name: '4x4', description: 'Ônibus rural com tração nas quatro rodas' }
        ]
      },
      {
        id: 'tourism',
        name: 'Turismo',
        subcategories: [
          { id: 'tourism-executive', name: 'Executivo', description: 'Ônibus de turismo executivo' },
          { id: 'tourism-luxury', name: 'Luxo', description: 'Ônibus de turismo de luxo' },
          { id: 'tourism-panoramic', name: 'Panorâmico', description: 'Ônibus com teto de vidro' }
        ]
      },
      {
        id: 'charter',
        name: 'Fretamento',
        subcategories: [
          { id: 'charter-corporate', name: 'Corporativo', description: 'Para empresas' },
          { id: 'charter-event', name: 'Eventos', description: 'Para eventos e festas' },
          { id: 'charter-tour', name: 'Excursão', description: 'Para passeios e viagens' }
        ]
      }
    ]
  },
  {
    id: 'car',
    name: 'Automóveis',
    icon: '🚗',
    categories: [
      {
        id: 'sedan',
        name: 'Sedan',
        subcategories: [
          { id: 'sedan-compact', name: 'Compacto', description: 'Sedan pequeno' },
          { id: 'sedan-medium', name: 'Médio', description: 'Sedan médio' },
          { id: 'sedan-large', name: 'Grande', description: 'Sedan grande' },
          { id: 'sedan-luxury', name: 'Luxo', description: 'Sedan de luxo' }
        ]
      },
      {
        id: 'hatchback',
        name: 'Hatch',
        subcategories: [
          { id: 'hatch-compact', name: 'Compacto', description: 'Hatch pequeno' },
          { id: 'hatch-medium', name: 'Médio', description: 'Hatch médio' },
          { id: 'hatch-sport', name: 'Esportivo', description: 'Hatch esportivo' }
        ]
      },
      {
        id: 'suv',
        name: 'SUV',
        subcategories: [
          { id: 'suv-compact', name: 'Compacto', description: 'SUV compacto' },
          { id: 'suv-medium', name: 'Médio', description: 'SUV médio' },
          { id: 'suv-large', name: 'Grande', description: 'SUV grande' },
          { id: 'suv-luxury', name: 'Luxo', description: 'SUV de luxo' }
        ]
      },
      {
        id: 'pickup',
        name: 'Picape',
        subcategories: [
          { id: 'pickup-compact', name: 'Compacta', description: 'Picape pequena' },
          { id: 'pickup-medium', name: 'Média', description: 'Picape média' },
          { id: 'pickup-large', name: 'Grande', description: 'Picape grande' }
        ]
      },
      {
        id: 'sports',
        name: 'Esportivo',
        subcategories: [
          { id: 'sports-coupe', name: 'Cupê', description: 'Carro esportivo 2 portas' },
          { id: 'sports-convertible', name: 'Conversível', description: 'Carro esportivo conversível' },
          { id: 'sports-supercar', name: 'Superesportivo', description: 'Supercarro' }
        ]
      },
      {
        id: 'station-wagon',
        name: 'Perua/SW',
        subcategories: [
          { id: 'sw-compact', name: 'Compacta', description: 'Station wagon compacta' },
          { id: 'sw-medium', name: 'Média', description: 'Station wagon média' },
          { id: 'sw-large', name: 'Grande', description: 'Station wagon grande' }
        ]
      },
      {
        id: 'minivan',
        name: 'Minivan',
        subcategories: [
          { id: 'minivan-7seats', name: '7 Lugares', description: 'Minivan 7 passageiros' },
          { id: 'minivan-8seats', name: '8 Lugares', description: 'Minivan 8 passageiros' }
        ]
      }
    ]
  },
  {
    id: 'truck',
    name: 'Caminhões',
    icon: '🚚',
    categories: [
      {
        id: 'light-truck',
        name: 'Leve',
        subcategories: [
          { id: 'light-3500kg', name: '3/4 (3.5 ton)', description: 'Até 3.5 toneladas' },
          { id: 'light-6000kg', name: 'Toco (6 ton)', description: 'Até 6 toneladas' },
          { id: 'light-box', name: 'Baú', description: 'Caminhão baú leve' },
          { id: 'light-refrigerated', name: 'Refrigerado', description: 'Caminhão frigorífico leve' }
        ]
      },
      {
        id: 'medium-truck',
        name: 'Médio',
        subcategories: [
          { id: 'medium-truck', name: 'Truck (2 eixos)', description: 'Caminhão truck' },
          { id: 'medium-tractor', name: 'Toco (3 eixos)', description: 'Caminhão toco 3 eixos' },
          { id: 'medium-box', name: 'Baú', description: 'Caminhão baú médio' },
          { id: 'medium-refrigerated', name: 'Refrigerado', description: 'Caminhão frigorífico médio' }
        ]
      },
      {
        id: 'heavy-truck',
        name: 'Pesado',
        subcategories: [
          { id: 'heavy-tractor', name: 'Cavalo Mecânico', description: 'Cavalo mecânico' },
          { id: 'heavy-6x2', name: '6x2', description: 'Caminhão 6x2' },
          { id: 'heavy-6x4', name: '6x4', description: 'Caminhão 6x4' },
          { id: 'heavy-8x2', name: '8x2', description: 'Caminhão 8x2' },
          { id: 'heavy-bitruck', name: 'Bitruck', description: 'Caminhão bitruck' }
        ]
      },
      {
        id: 'special-truck',
        name: 'Especial',
        subcategories: [
          { id: 'special-dump', name: 'Basculante', description: 'Caminhão basculante' },
          { id: 'special-crane', name: 'Munck', description: 'Caminhão com guindaste' },
          { id: 'special-mixer', name: 'Betoneira', description: 'Caminhão betoneira' },
          { id: 'special-tanker', name: 'Tanque', description: 'Caminhão tanque' },
          { id: 'special-garbage', name: 'Compactador', description: 'Caminhão de lixo' }
        ]
      }
    ]
  },
  {
    id: 'van',
    name: 'Vans',
    icon: '🚐',
    categories: [
      {
        id: 'passenger-van',
        name: 'Passageiros',
        subcategories: [
          { id: 'van-8seats', name: '8 Lugares', description: 'Van 8 passageiros' },
          { id: 'van-12seats', name: '12 Lugares', description: 'Van 12 passageiros' },
          { id: 'van-15seats', name: '15 Lugares', description: 'Van 15 passageiros' },
          { id: 'van-executive', name: 'Executiva', description: 'Van executiva' }
        ]
      },
      {
        id: 'cargo-van',
        name: 'Carga',
        subcategories: [
          { id: 'cargo-van-standard', name: 'Padrão', description: 'Van de carga padrão' },
          { id: 'cargo-van-long', name: 'Alongada', description: 'Van de carga alongada' },
          { id: 'cargo-van-high', name: 'Alto', description: 'Van de carga com teto alto' },
          { id: 'cargo-van-refrigerated', name: 'Refrigerada', description: 'Van frigorífica' }
        ]
      }
    ]
  },
  {
    id: 'motorcycle',
    name: 'Motocicletas',
    icon: '🏍️',
    categories: [
      {
        id: 'street',
        name: 'Street',
        subcategories: [
          { id: 'street-125cc', name: '125cc', description: 'Moto urbana 125cc' },
          { id: 'street-150cc', name: '150cc', description: 'Moto urbana 150cc' },
          { id: 'street-250cc', name: '250cc', description: 'Moto urbana 250cc' },
          { id: 'street-300cc-plus', name: '300cc+', description: 'Moto urbana acima de 300cc' }
        ]
      },
      {
        id: 'sport',
        name: 'Esportiva',
        subcategories: [
          { id: 'sport-300cc', name: '300cc', description: 'Esportiva 300cc' },
          { id: 'sport-600cc', name: '600cc', description: 'Esportiva 600cc' },
          { id: 'sport-1000cc', name: '1000cc', description: 'Esportiva 1000cc' },
          { id: 'sport-superbike', name: 'Superbike', description: 'Superbike' }
        ]
      },
      {
        id: 'touring',
        name: 'Touring',
        subcategories: [
          { id: 'touring-medium', name: 'Média', description: 'Touring média cilindrada' },
          { id: 'touring-large', name: 'Grande', description: 'Touring grande cilindrada' },
          { id: 'touring-adventure', name: 'Adventure', description: 'Adventure touring' }
        ]
      },
      {
        id: 'off-road',
        name: 'Off-Road',
        subcategories: [
          { id: 'offroad-trail', name: 'Trail', description: 'Trail leve' },
          { id: 'offroad-enduro', name: 'Enduro', description: 'Enduro' },
          { id: 'offroad-motocross', name: 'Motocross', description: 'Motocross' }
        ]
      },
      {
        id: 'scooter',
        name: 'Scooter',
        subcategories: [
          { id: 'scooter-50cc', name: '50cc', description: 'Scooter 50cc' },
          { id: 'scooter-125cc', name: '125cc', description: 'Scooter 125cc' },
          { id: 'scooter-150cc', name: '150cc', description: 'Scooter 150cc' },
          { id: 'scooter-300cc-plus', name: '300cc+', description: 'Scooter grande cilindrada' }
        ]
      },
      {
        id: 'custom',
        name: 'Custom',
        subcategories: [
          { id: 'custom-cruiser', name: 'Cruiser', description: 'Custom cruiser' },
          { id: 'custom-bobber', name: 'Bobber', description: 'Custom bobber' },
          { id: 'custom-chopper', name: 'Chopper', description: 'Custom chopper' }
        ]
      }
    ]
  },
  {
    id: 'motorhome',
    name: 'Motorhome',
    icon: '🚙',
    categories: [
      {
        id: 'motorhome-class',
        name: 'Classe',
        subcategories: [
          { id: 'motorhome-class-a', name: 'Classe A', description: 'Motorhome grande porte' },
          { id: 'motorhome-class-b', name: 'Classe B', description: 'Motorhome médio porte' },
          { id: 'motorhome-class-c', name: 'Classe C', description: 'Motorhome compacto' }
        ]
      }
    ]
  },
  {
    id: 'trailer',
    name: 'Reboques',
    icon: '🚛',
    categories: [
      {
        id: 'semi-trailer',
        name: 'Semirreboque',
        subcategories: [
          { id: 'semi-trailer-box', name: 'Baú', description: 'Semirreboque baú' },
          { id: 'semi-trailer-refrigerated', name: 'Refrigerado', description: 'Semirreboque frigorífico' },
          { id: 'semi-trailer-flatbed', name: 'Plataforma', description: 'Semirreboque plataforma' },
          { id: 'semi-trailer-tank', name: 'Tanque', description: 'Semirreboque tanque' },
          { id: 'semi-trailer-sider', name: 'Sider', description: 'Semirreboque sider' }
        ]
      },
      {
        id: 'trailer',
        name: 'Reboque',
        subcategories: [
          { id: 'trailer-box', name: 'Baú', description: 'Reboque baú' },
          { id: 'trailer-flatbed', name: 'Plataforma', description: 'Reboque plataforma' },
          { id: 'trailer-dolly', name: 'Dolly', description: 'Dolly' }
        ]
      }
    ]
  },
  {
    id: 'agricultural',
    name: 'Agrícola',
    icon: '🚜',
    categories: [
      {
        id: 'tractor',
        name: 'Trator',
        subcategories: [
          { id: 'tractor-compact', name: 'Compacto', description: 'Trator compacto até 75cv' },
          { id: 'tractor-medium', name: 'Médio', description: 'Trator médio 75-150cv' },
          { id: 'tractor-large', name: 'Grande', description: 'Trator grande acima de 150cv' }
        ]
      },
      {
        id: 'harvester',
        name: 'Colheitadeira',
        subcategories: [
          { id: 'harvester-grain', name: 'Grãos', description: 'Colheitadeira de grãos' },
          { id: 'harvester-sugarcane', name: 'Cana', description: 'Colheitadeira de cana' },
          { id: 'harvester-cotton', name: 'Algodão', description: 'Colheitadeira de algodão' }
        ]
      },
      {
        id: 'implement',
        name: 'Implemento',
        subcategories: [
          { id: 'implement-plow', name: 'Arado', description: 'Arado' },
          { id: 'implement-seeder', name: 'Plantadeira', description: 'Plantadeira' },
          { id: 'implement-sprayer', name: 'Pulverizador', description: 'Pulverizador' },
          { id: 'implement-trailer', name: 'Carreta', description: 'Carreta agrícola' }
        ]
      }
    ]
  },
  {
    id: 'construction',
    name: 'Construção',
    icon: '🏗️',
    categories: [
      {
        id: 'excavator',
        name: 'Escavadeira',
        subcategories: [
          { id: 'excavator-mini', name: 'Mini', description: 'Escavadeira mini até 6 ton' },
          { id: 'excavator-medium', name: 'Média', description: 'Escavadeira média 6-30 ton' },
          { id: 'excavator-large', name: 'Grande', description: 'Escavadeira grande acima de 30 ton' }
        ]
      },
      {
        id: 'loader',
        name: 'Pá Carregadeira',
        subcategories: [
          { id: 'loader-compact', name: 'Compacta', description: 'Pá carregadeira compacta' },
          { id: 'loader-medium', name: 'Média', description: 'Pá carregadeira média' },
          { id: 'loader-large', name: 'Grande', description: 'Pá carregadeira grande' }
        ]
      },
      {
        id: 'roller',
        name: 'Rolo Compactador',
        subcategories: [
          { id: 'roller-vibrating', name: 'Vibratório', description: 'Rolo compactador vibratório' },
          { id: 'roller-pneumatic', name: 'Pneumático', description: 'Rolo compactador pneumático' }
        ]
      },
      {
        id: 'grader',
        name: 'Motoniveladora',
        subcategories: [
          { id: 'grader-medium', name: 'Média', description: 'Motoniveladora média' },
          { id: 'grader-large', name: 'Grande', description: 'Motoniveladora grande' }
        ]
      }
    ]
  },
  {
    id: 'nautical',
    name: 'Náutico',
    icon: '⛵',
    categories: [
      {
        id: 'boat',
        name: 'Lancha',
        subcategories: [
          { id: 'boat-small', name: 'Pequena', description: 'Lancha até 20 pés' },
          { id: 'boat-medium', name: 'Média', description: 'Lancha 20-40 pés' },
          { id: 'boat-large', name: 'Grande', description: 'Lancha acima de 40 pés' }
        ]
      },
      {
        id: 'yacht',
        name: 'Iate',
        subcategories: [
          { id: 'yacht-medium', name: 'Médio', description: 'Iate 40-60 pés' },
          { id: 'yacht-large', name: 'Grande', description: 'Iate acima de 60 pés' }
        ]
      },
      {
        id: 'jetski',
        name: 'Jet Ski',
        subcategories: [
          { id: 'jetski-standard', name: 'Padrão', description: 'Jet ski padrão' },
          { id: 'jetski-performance', name: 'Performance', description: 'Jet ski de alta performance' }
        ]
      }
    ]
  }
];

export const comfortCategories = [
  { id: 'conventional', name: 'Convencional', description: 'Categoria mais básica, assentos simples e reclináveis' },
  { id: 'executive', name: 'Executivo', description: 'Poltronas reclináveis, ar condicionado, alguns com banheiro' },
  { id: 'semi-sleeper', name: 'Semi-leito', description: 'Mais reclinação, apoio de pernas, ideal para longas viagens' },
  { id: 'sleeper', name: 'Leito', description: 'Quase totalmente reclinável, muito confortável, apoio de pés' },
  { id: 'sleeper-bed', name: 'Leito-cama', description: 'Poltronas que viram camas, máximo de conforto' }
];

export const fuelTypes = [
  'Diesel',
  'Diesel S10',
  'Gasolina',
  'Gasolina e Álcool (Flex)',
  'Álcool',
  'Elétrico',
  'Híbrido (Gasolina)',
  'Híbrido (Diesel)',
  'Gás Natural (GNV)',
  'Gasolina e GNV',
  'Biodiesel'
];
