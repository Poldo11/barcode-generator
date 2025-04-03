import { useState } from 'react';
import { LiterariusService } from '@/lib/services/literarius';
import { type ObjetoPostal, type Remetente } from '@/lib/constants';

interface UseLiterariusReturn {
  loading: boolean;
  error: Error | null;
  fetchNotaFiscal: (id: string) => Promise<void>;
  data: {
    remetente: Remetente;
    objeto: ObjetoPostal;
  } | null;
}

export function useLiterarius(): UseLiterariusReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<{
    remetente: Remetente;
    objeto: ObjetoPostal;
  } | null>(null);

  const service = new LiterariusService({
    baseUrl: process.env.NEXT_PUBLIC_LITERARIUS_API_URL || '',
    company: process.env.NEXT_PUBLIC_LITERARIUS_COMPANY || '',
    token: process.env.NEXT_PUBLIC_LITERARIUS_TOKEN || '',
  });

  const fetchNotaFiscal = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const notaFiscal = await service.getNotaFiscal(id);
      const transformedData = service.transformToCorreiosFormat(notaFiscal);
      
      setData(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch nota fiscal'));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchNotaFiscal,
    data,
  };
} 