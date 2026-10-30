// Minimal MCP client over HTTP (no AI client). Prints every request and raw response.
//   node scripts/mcp.mjs list-tools
//   node scripts/mcp.mjs test-run '{"stories":[{"storyId":"probe-themeprobe--expects-dark","globals":{"theme":"dark"}}]}'
const url = process.env.MCP_URL ?? 'http://localhost:6107/mcp';
const headers = { 'content-type': 'application/json', accept: 'application/json, text/event-stream' };

async function rpc(body, extra = {}) {
  console.log('>>> ' + JSON.stringify(body));
  const res = await fetch(url, { method: 'POST', headers: { ...headers, ...extra }, body: JSON.stringify(body) });
  const text = await res.text();
  console.log(`<<< HTTP ${res.status}\n${text.trim()}\n`);
  return { res, text };
}

const [cmd, arg] = process.argv.slice(2);
const init = await rpc({
  jsonrpc: '2.0', id: 1, method: 'initialize',
  params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'repro-script', version: '0.0.0' } },
});
const sid = init.res.headers.get('mcp-session-id');
const extra = sid ? { 'mcp-session-id': sid } : {};
await rpc({ jsonrpc: '2.0', method: 'notifications/initialized' }, extra);

if (cmd === 'list-tools') {
  await rpc({ jsonrpc: '2.0', id: 2, method: 'tools/list' }, extra);
} else {
  await rpc({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: cmd, arguments: JSON.parse(arg ?? '{}') } }, extra);
}
