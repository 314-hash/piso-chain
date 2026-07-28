# PISO Chain Multi-Region Bootnode Infrastructure (Terraform)
# Provisions 3 geographically dispersed bootnodes across AWS and Hetzner

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.45"
    }
  }
}

# AWS Provider - Region 1: US-East (N. Virginia)
provider "aws" {
  alias  = "us_east"
  region = var.aws_region_us
}

# AWS Provider - Region 2: AP-East (Tokyo)
provider "aws" {
  alias  = "ap_east"
  region = var.aws_region_ap
}

# Hetzner Cloud Provider - Region 3: EU (Frankfurt/Falkenstein)
provider "hcloud" {
  token = var.hcloud_token
}

# Security Group - AWS US East
resource "aws_security_group" "bootnode_sg_us" {
  provider    = aws.us_east
  name        = "piso-bootnode-sg-us"
  description = "PISO Chain Bootnode P2P & RPC Traffic"

  ingress {
    from_port   = 30301
    to_port     = 30301
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 30301
    to_port     = 30301
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Security Group - AWS AP East
resource "aws_security_group" "bootnode_sg_ap" {
  provider    = aws.ap_east
  name        = "piso-bootnode-sg-ap"
  description = "PISO Chain Bootnode P2P Traffic"

  ingress {
    from_port   = 30301
    to_port     = 30301
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 30301
    to_port     = 30301
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Bootnode 1 - AWS US East (N. Virginia)
resource "aws_instance" "bootnode_us" {
  provider      = aws.us_east
  ami           = var.aws_ami_us
  instance_type = "t3.medium"
  vpc_security_group_ids = [aws_security_group.bootnode_sg_us.id]

  user_data = <<-EOF
              #!/bin/bash
              curl -fsSL https://get.docker.com | sh
              docker run -d --name piso-bootnode-us \
                --net=host \
                ghcr.io/bnb-chain/bsc:latest \
                bootnode --nodekeyhex=${var.bootnode_key_us} --verbosity=3 --addr=:30301
              EOF

  tags = {
    Name = "PISO-Bootnode-US-East"
    Role = "Bootnode"
  }
}

# Bootnode 2 - Hetzner EU (Frankfurt)
resource "hcloud_server" "bootnode_eu" {
  name        = "piso-bootnode-eu-hetzner"
  image       = "ubuntu-22.04"
  server_type = "cx21"
  location    = "fsn1"

  user_data = <<-EOF
              #!/bin/bash
              curl -fsSL https://get.docker.com | sh
              docker run -d --name piso-bootnode-eu \
                --net=host \
                ghcr.io/bnb-chain/bsc:latest \
                bootnode --nodekeyhex=${var.bootnode_key_eu} --verbosity=3 --addr=:30301
              EOF
}

# Bootnode 3 - AWS AP East (Tokyo)
resource "aws_instance" "bootnode_ap" {
  provider      = aws.ap_east
  ami           = var.aws_ami_ap
  instance_type = "t3.medium"
  vpc_security_group_ids = [aws_security_group.bootnode_sg_ap.id]

  user_data = <<-EOF
              #!/bin/bash
              curl -fsSL https://get.docker.com | sh
              docker run -d --name piso-bootnode-ap \
                --net=host \
                ghcr.io/bnb-chain/bsc:latest \
                bootnode --nodekeyhex=${var.bootnode_key_ap} --verbosity=3 --addr=:30301
              EOF

  tags = {
    Name = "PISO-Bootnode-AP-East"
    Role = "Bootnode"
  }
}

output "bootnode_us_ip" {
  value = aws_instance.bootnode_us.public_ip
}

output "bootnode_eu_ip" {
  value = hcloud_server.bootnode_eu.ipv4_address
}

output "bootnode_ap_ip" {
  value = aws_instance.bootnode_ap.public_ip
}
