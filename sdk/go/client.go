package pisosdk

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// Client handles RPC interactions with PISO Chain node.
type Client struct {
	RPCURL     string
	HTTPClient *http.Client
}

type jsonRPCRequest struct {
	JSONRPC string        `json:"jsonrpc"`
	Method  string        `json:"method"`
	Params  []interface{} `json:"params"`
	ID      int           `json:"id"`
}

type jsonRPCResponse struct {
	JSONRPC string          `json:"jsonrpc"`
	ID      int             `json:"id"`
	Result  json.RawMessage `json:"result,omitempty"`
	Error   interface{}     `json:"error,omitempty"`
}

// NewClient instantiates a new Client.
func NewClient(rpcURL string) *Client {
	return &Client{
		RPCURL: rpcURL,
		HTTPClient: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

// BroadcastTransaction broadcasts signed raw transaction hex string.
func (c *Client) BroadcastTransaction(rawTx string) (string, error) {
	req := jsonRPCRequest{
		JSONRPC: "2.0",
		Method:  "eth_sendRawTransaction",
		Params:  []interface{}{rawTx},
		ID:      1,
	}

	body, err := json.Marshal(req)
	if err != nil {
		return "", err
	}

	resp, err := c.HTTPClient.Post(c.RPCURL, "application/json", bytes.NewBuffer(body))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	respBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var rpcResp jsonRPCResponse
	if err := json.Unmarshal(respBytes, &rpcResp); err != nil {
		return "", err
	}

	var txHash string
	if err := json.Unmarshal(rpcResp.Result, &txHash); err != nil {
		return "", err
	}

	return txHash, nil
}

// GetBalance queries balance for given account address.
func (c *Client) GetBalance(address string) (string, error) {
	req := jsonRPCRequest{
		JSONRPC: "2.0",
		Method:  "eth_getBalance",
		Params:  []interface{}{address, "latest"},
		ID:      1,
	}

	body, err := json.Marshal(req)
	if err != nil {
		return "", err
	}

	resp, err := c.HTTPClient.Post(c.RPCURL, "application/json", bytes.NewBuffer(body))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	respBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var rpcResp jsonRPCResponse
	if err := json.Unmarshal(respBytes, &rpcResp); err != nil {
		return "", err
	}

	var balance string
	if err := json.Unmarshal(rpcResp.Result, &balance); err != nil {
		return "", err
	}

	return balance, nil
}
