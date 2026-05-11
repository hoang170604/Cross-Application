
/**
 * @file activityService.ts
 * @description API Layer cho module Hoạt động (Activity).
 * Endpoints: GET /api/activities/types, GET /api/activities/users/{userId}/history, etc.
 */

import apiClient from './apiClient';
import { ApiResponse } from '../types/api.types';
import type { Activity, ActivityTypeInfo } from '../types/workout.types';

/** Lấy danh sách các loại bài tập hỗ trợ */
export const getActivityTypes = async (): Promise<ApiResponse<ActivityTypeInfo[]>> => {
  const response = await apiClient.get<ApiResponse<ActivityTypeInfo[]>>('/api/activities/types');
  return response.data;
};

/** Lấy lịch sử hoạt động trong một khoảng thời gian */
export const getActivityHistory = async (
  userId: number,
  startDate: string,
  endDate: string
): Promise<ApiResponse<Activity[]>> => {
  const response = await apiClient.get<ApiResponse<Activity[]>>(
    `/api/activities/users/${userId}/history`,
    { params: { startDate, endDate } }
  );
  return response.data;
};

/** Lấy tổng lượng Calo đốt cháy trong ngày */
export const getCaloriesBurnedDaily = async (
  userId: number,
  date: string
): Promise<ApiResponse<number>> => {
  const response = await apiClient.get<ApiResponse<number>>(
    `/api/activities/users/${userId}/calories-daily`,
    { params: { date } }
  );
  return response.data;
};

/** Thêm hoạt động mới */
export const addActivity = async (
  userId: number,
  activity: Partial<Activity>
): Promise<ApiResponse<Activity>> => {
  const response = await apiClient.post<ApiResponse<Activity>>(
    `/api/activities/users/${userId}`,
    activity
  );
  return response.data;
};

/** Cập nhật hoạt động */
export const updateActivity = async (
  id: number,
  update: Partial<Activity>
): Promise<ApiResponse<Activity>> => {
  const response = await apiClient.put<ApiResponse<Activity>>(
    `/api/activities/${id}`,
    update
  );
  return response.data;
};

/** Xóa hoạt động */
export const deleteActivity = async (id: number): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`/api/activities/${id}`);
  return response.data;
};
