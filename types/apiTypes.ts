export type IndexResponse = string;
export type EchoResponse = string;
export type AccountsResponse = {
  accounts: string[];
};
export type ProcessStartResponse = string;
export type ProcessStartParameters = {
  account?: number;
  recover?: number;
  limit?: number;
  test?: boolean;
  price?: number;
};
export type ProcessStopResponse = string;
export type ProcessStopParameters = {
  processNumber: number;
};
export type ProcessStatusResponse = {
  logs: string[];
};
export type Process = {
  accountIndex: number;
  address: string;
};
export type ProcessListResponse = {
  solvers: Process[];
  verifiers: Process[];
};
export type TaskListResponse = {
  data: {
    logs: string[];
    submitter: string;
    failed: boolean;
    submitted: boolean;
    hash: string;
  };
};
export type TaskSubmitResponse = {
  hash: string;
  message: string;
};
export type TaskParametersResponse = {
  data: {
    bundleId: string;
    mindeposit: string;
    solverReward: string;
    verifierTax: string;
    ownerFee: string;
    blockLimit: string;
    owner: string;
    submitter: string;
    selectedSolver: string;
    currentGame: string;
    state: string;
    message: string;
  };
};
export type TaskStatusResponse = {
  data: {
    logs: string[];
  };
};
