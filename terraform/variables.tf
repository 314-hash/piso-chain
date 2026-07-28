# Terraform Variables for PISO Chain Bootnodes

variable "aws_region_us" {
  type        = string
  default     = "us-east-1"
  description = "AWS region for Bootnode 1"
}

variable "aws_region_ap" {
  type        = string
  default     = "ap-northeast-1"
  description = "AWS region for Bootnode 3"
}

variable "aws_ami_us" {
  type        = string
  default     = "ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS us-east-1
  description = "Ubuntu AMI ID for AWS US-East"
}

variable "aws_ami_ap" {
  type        = string
  default     = "ami-0d52744d6db51b046" # Ubuntu 22.04 LTS ap-northeast-1
  description = "Ubuntu AMI ID for AWS AP-East"
}

variable "hcloud_token" {
  type        = string
  sensitive   = true
  default     = "DUMMY_HETZNER_TOKEN_FOR_MAINNET"
  description = "Hetzner Cloud API token"
}

variable "bootnode_key_us" {
  type        = string
  sensitive   = true
  default     = "4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
  description = "Private key hex for Bootnode 1"
}

variable "bootnode_key_eu" {
  type        = string
  sensitive   = true
  default     = "6cbed15c793ce57650b9877760044f29cb37d78d904c114d0a316421ce82cda0"
  description = "Private key hex for Bootnode 2"
}

variable "bootnode_key_ap" {
  type        = string
  sensitive   = true
  default     = "a23b456789012345678901234567890123456789012345678901234567890123"
  description = "Private key hex for Bootnode 3"
}
