export type NetworkContracts = {
  WAIT_TIME: number;
  fileSystem: ContractDetails;
  judge: ContractDetails;
  interactive: ContractDetails;
  incentiveLayer: ContractDetails;
  IPFSnodeManager: ContractDetails;
  tru: ContractDetails;
  purchase: ContractDetails;
};

type ContractDetails = {
  address: string;
  abi: ABI[];
};

type ABI = {
  anonymous?: boolean;
  inputs: ABIInputs[];
  name: string;
  type: string;
  constant?: boolean;
  outputs?: ABIOutputs[];
  payable?: boolean;
  stateMutability?: string;
};

type ABIInputs = {
  indexed?: boolean;
  internalType: string;
  name: string;
  type: string;
};

type ABIOutputs = {
  internalType: string;
  name: string;
  type: string;
};
