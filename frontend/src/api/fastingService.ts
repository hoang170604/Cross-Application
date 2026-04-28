/**
 * @file fastingService.ts
 * @description API Layer cho module Nhịn ăn gián đoạn (Fasting).
 * Endpoints: POST /api/fasting/start, POST /api/fasting/stop, GET /api/fasting/sessions/*
 */

import apiClient from './apiClient';
import { ApiResponse } from '../types/api.types';
import type { FastingSession, FastingStatePayload } from '../types/fasting.types';

/** Bắt đầu nhịn ăn */
export const startFasting = async (payload: FastingStatePayload): Promise<ApiResponse<null>> => {
  const response = await apiClient.post<ApiResponse<null>>('/api/fasting/start', payload);
  return response.data;
};

/** Dừng nhịn ăn */
export const stopFasting = async (payload: FastingStatePayload): Promise<ApiResponse<null>> => {
  const response = await apiClient.post<ApiResponse<null>>('/api/fasting/stop', payload);
  return response.data;
};

/** Lấy tất cả phiên nhịn ăn của user */
export const getFastingSessions = async (userId: number): Promise<ApiResponse<FastingSession[]>> => {
  const response = await apiClient.get<ApiResponse<FastingSession[]>>(`/api/fasting/sessions/${userId}`);
  return response.data;
};

/** Lấy phiên nhịn ăn đang mở (chưa hoàn thành) */
export const getOpenFastingSession = async (userId: number): Promise<ApiResponse<FastingSession>> => {
  const response = await apiClient.get<ApiResponse<FastingSession>>(`/api/fasting/sessions/${userId}/open`);
  return response.data;
};
