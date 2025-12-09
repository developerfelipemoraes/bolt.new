import {
  Pipeline,
  PipelineCreatePayload,
  PipelineUpdatePayload,
  DEFAULT_PIPELINE_STAGES
} from '../types/pipeline';

const MOCK_PIPELINES: Pipeline[] = [
  {
    id: 'PIPE-DEFAULT',
    name: 'Pipeline Padrão de Vendas',
    description: 'Funil padrão para vendas de veículos',
    is_default: true,
    stages: DEFAULT_PIPELINE_STAGES.map((stage, index) => ({
      ...stage,
      id: `STAGE-${String(index + 1).padStart(2, '0')}`
    })),
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    created_by: 'SYSTEM'
  }
];

export const pipelineService = {
  async getAll(): Promise<Pipeline[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...MOCK_PIPELINES];
  },

  async getById(id: string): Promise<Pipeline | null> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const pipeline = MOCK_PIPELINES.find(pipe => pipe.id === id);
    return pipeline ? { ...pipeline } : null;
  },

  async getDefault(): Promise<Pipeline> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const defaultPipeline = MOCK_PIPELINES.find(pipe => pipe.is_default);
    if (!defaultPipeline) {
      throw new Error('Pipeline padrão não encontrado');
    }

    return { ...defaultPipeline };
  },

  async create(payload: PipelineCreatePayload): Promise<Pipeline> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const newPipeline: Pipeline = {
      id: `PIPE-${String(MOCK_PIPELINES.length + 1).padStart(3, '0')}`,
      name: payload.name,
      description: payload.description,
      is_default: false,
      stages: payload.stages.map((stage, index) => ({
        ...stage,
        id: `STAGE-${Date.now()}-${index}`
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'USR-001'
    };

    MOCK_PIPELINES.push(newPipeline);

    return { ...newPipeline };
  },

  async update(id: string, payload: PipelineUpdatePayload): Promise<Pipeline> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = MOCK_PIPELINES.findIndex(pipe => pipe.id === id);
    if (index === -1) {
      throw new Error('Pipeline não encontrado');
    }

    if (MOCK_PIPELINES[index].is_default) {
      throw new Error('Não é possível editar o pipeline padrão');
    }

    const stages = payload.stages
      ? payload.stages.map((stage, idx) => ({
          ...stage,
          id: `STAGE-${Date.now()}-${idx}`
        }))
      : MOCK_PIPELINES[index].stages;

    MOCK_PIPELINES[index] = {
      ...MOCK_PIPELINES[index],
      name: payload.name || MOCK_PIPELINES[index].name,
      description: payload.description !== undefined
        ? payload.description
        : MOCK_PIPELINES[index].description,
      stages,
      updated_at: new Date().toISOString()
    };

    return { ...MOCK_PIPELINES[index] };
  },

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = MOCK_PIPELINES.findIndex(pipe => pipe.id === id);
    if (index === -1) {
      throw new Error('Pipeline não encontrado');
    }

    if (MOCK_PIPELINES[index].is_default) {
      throw new Error('Não é possível excluir o pipeline padrão');
    }

    MOCK_PIPELINES.splice(index, 1);
  }
};
