import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import type { CityWeather } from '../types/weather';

export function useWeatherData() {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<CityWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('/weather');
      const result = response.data;

      if (result.success) {
        setData(result.data);
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchInsights = async (cityCode: string) => {
    try {
      const response = await axios.get(`/weather/${cityCode}/insights`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch insights', error);
      return [];
    }
  };

  const fetchHistory = async (cityCode: string) => {
    try {
      const response = await axios.get(`/weather/${cityCode}/history`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch history', error);
      return [];
    }
  };

  const fetchTrends = async (cityCode: string) => {
    try {
      const response = await axios.get(`/weather/${cityCode}/trends`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch trends', error);
      return null;
    }
  };

  const fetchReport = async (cityCode: string, period = 'daily') => {
    try {
      const response = await axios.get(`/weather/${cityCode}/report`, { params: { period } });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch report', error);
      return '';
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { data, loading, error, refetch: fetchWeather, fetchInsights, fetchHistory, fetchTrends, fetchReport };
}
