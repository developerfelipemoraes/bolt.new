import { VehicleCategory } from '../types/vehicle';

export const vehicleCategories: VehicleCategory[] = [
  {
    id: 'cars-trucks',
    name: 'Carros e Caminhonetes'
  },
  {
    id: 'vans',
    name: 'Vans'
  },
  {
    id: 'motorcycles',
    name: 'Motos'
  },
  {
    id: 'trucks',
    name: 'Caminhões'
  },
  {
    id: 'nautical',
    name: 'Náutica'
  },
  {
    id: 'classic-cars',
    name: 'Carros Antigos'
  },
  {
    id: 'consortium',
    name: 'Consórcios'
  },
  {
    id: 'motorhomes',
    name: 'Motorhomes'
  },
  {
    id: 'buses',
    name: 'Ônibus',
    subcategories: [
      {
        id: 'highway',
        name: 'Rodoviária',
        description: 'Para viagens de longa distância'
      },
      {
        id: 'urban',
        name: 'Urbano',
        description: 'Para transporte urbano'
      }
    ]
  },
  {
    id: 'heavy-vehicles',
    name: 'Veículos Pesados'
  },
  {
    id: 'agricultural',
    name: 'Máquinas e Equipamentos Agrícolas'
  }
];

export const busHighwaySubcategories = [
  { id: 'highway-bus', name: 'Ônibus Rodoviário', description: 'Ônibus convencional para viagens' },
  { id: 'double-deck', name: 'DD (Double Deck)', description: 'Ônibus de dois andares' },
  { id: 'low-driver', name: 'LD (Low Driver)', description: 'Ônibus com motorista em posição baixa' },
  { id: 'midi-highway', name: 'Midi Rodoviário', description: 'Ônibus de tamanho médio' },
  { id: 'micro-highway', name: 'Micro Rodoviário', description: 'Ônibus pequeno para viagens' }
];

export const busUrbanSubcategories = [
  { id: 'bi-articulated', name: 'Biarticulado', description: 'Três seções, capacidade máxima em corredores de grande fluxo' },
  { id: 'articulated', name: 'Articulado', description: 'Duas seções conectadas, maior capacidade' },
  { id: 'padron', name: 'Padron', description: 'Usado em corredores de alta demanda, até 14m, até 80 passageiros' },
  { id: 'midi', name: 'Midi', description: 'Intermediário entre micro e padron' },
  { id: 'basic', name: 'Básico', description: 'Tradicional, maior capacidade que micro/midi' },
  { id: 'micro', name: 'Micro', description: 'Menor capacidade, usado em linhas de baixa demanda' }
];

export const comfortCategories = [
  { id: 'conventional', name: 'Convencional', description: 'Categoria mais básica, assentos simples e reclináveis, sem ar condicionado ou banheiro' },
  { id: 'executive', name: 'Executivo', description: 'Poltronas reclináveis, ar condicionado, alguns com banheiro' },
  { id: 'semi-sleeper', name: 'Semi-leito', description: 'Mais reclinação, apoio de pernas, ideal para longas viagens' },
  { id: 'sleeper', name: 'Leito', description: 'Quase totalmente reclinável, muito confortável, apoio de pés, geralmente com serviço de bordo' },
  { id: 'sleeper-bed', name: 'Leito-cama', description: 'Poltronas que viram camas, máximo de conforto em viagens longas' }
];

export const fuelTypes = [
  'Gasolina e elétrico',
  'Gasolina-Álcool e gás natural',
  'Diesel',
  'Gasolina',
  'Gasolina e gás natural',
  'Híbrido',
  'Gasolina e álcool',
  'Híbrido/Diesel',
  'Álcool',
  'Híbrido/Gasolina'
];