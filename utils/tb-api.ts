import axios, { AxiosError, AxiosResponse } from 'axios';
import { Process } from './enums';
import {
  ProcessListResponse,
  ProcessStartParameters,
  ProcessStartResponse,
  ProcessStatusResponse,
  ProcessStopParameters,
  ProcessStopResponse,
  TaskListResponse,
  TaskParametersResponse,
  TaskStatusResponse,
  TaskSubmitResponse,
} from '../types/apiTypes';

const apiURL = process.env.API_URL;

function handleApiError(err: AxiosError): void {
  if (err.response) {
    console.error(err.response.data);
    console.error(err.response.status);
    console.error(err.response.headers);
  } else if (err.request) {
    console.error(err.request);
  } else {
    console.error('Error', err.message);
  }
  console.error(err.config);
  throw err;
}
export async function startProcess(processType: Process, params: ProcessStartParameters): Promise<AxiosResponse<ProcessStartResponse> | undefined> {
  try {
    if (processType != Process.SOLVER && processType != Process.VERIFIER) {
      throw new Error(`Invalid process type`);
    }
    return await axios.post<ProcessStartResponse>(`${apiURL}/api/${processType}/start`, params);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleApiError(err);
    } else {
      throw err;
    }
  }
}

export async function stopProcess(processType: Process, params: ProcessStopParameters): Promise<AxiosResponse<ProcessStopResponse> | undefined> {
  try {
    if (processType != Process.SOLVER && processType != Process.VERIFIER) {
      throw new Error(`Invalid process type`);
    }
    return await axios.post<ProcessStopResponse>(`${apiURL}/api/${processType}/stop`, params);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleApiError(err);
    } else {
      throw err;
    }
  }
}

export async function getProcesses(): Promise<AxiosResponse<ProcessListResponse> | undefined> {
  try {
    return await axios.get<ProcessListResponse>(`${apiURL}/api/processes/`);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleApiError(err);
    } else {
      throw err;
    }
  }
}

export async function getProcessStatus(
  processType: Process,
  params: Record<string, unknown>
): Promise<AxiosResponse<ProcessStatusResponse> | undefined> {
  try {
    return await axios.get<ProcessStatusResponse>(`${apiURL}/api/${processType}/status/${params.processNumber}`);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleApiError(err);
    } else {
      throw err;
    }
  }
}

export async function getTasks(): Promise<AxiosResponse<TaskListResponse> | undefined> {
  try {
    return await axios.get<TaskListResponse>(`${apiURL}/api/tasks`);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleApiError(err);
    } else {
      throw err;
    }
  }
}

export async function getTaskStatus(params: Record<string, unknown>): Promise<AxiosResponse<TaskStatusResponse> | undefined> {
  try {
    return await axios.get<TaskStatusResponse>(`${apiURL}/api/tasks/${params.taskHash}/status`);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleApiError(err);
    } else {
      throw err;
    }
  }
}

export async function getTaskParameters(params: Record<string, unknown>): Promise<AxiosResponse<TaskParametersResponse> | undefined> {
  try {
    return await axios.get<TaskParametersResponse>(`${apiURL}/api/tasks/${params.taskHash}/parameters`);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleApiError(err);
    } else {
      throw err;
    }
  }
}

export async function submitTask(params: Record<string, unknown>): Promise<AxiosResponse<TaskSubmitResponse> | undefined> {
  try {
    return await axios.post<TaskSubmitResponse>(`${apiURL}/api/tasks/submit`, {
      account: params.account,
      taskFile: params.taskFile,
    });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleApiError(err);
    } else {
      throw err;
    }
  }
}
