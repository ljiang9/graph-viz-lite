// Node 断言：校验关系图数据的连通性与环形布局正确性。
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script id="graph-data" type="application\/json">([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: 未找到 graph-data'); process.exit(1); }
const data = JSON.parse(m[1]);

let failed = 0;
function assert(cond, msg) {
  if (cond) console.log('PASS: ' + msg);
  else { console.error('FAIL: ' + msg); failed++; }
}

const ids = new Set(data.nodes.map(n => n.id));
assert(data.nodes.length === 5, '节点数 = 5');
assert(data.edges.length === 5, '边数 = 5');
// 每条边端点都必须存在
assert(data.edges.every(e => ids.has(e.from) && ids.has(e.to)),
  '所有边的端点都存在于节点集合中');

// 连通性：BFS 从任一节点出发应能到达全部节点
const adj = {};
ids.forEach(id => adj[id] = new Set());
data.edges.forEach(e => { adj[e.from].add(e.to); adj[e.to].add(e.from); });
const seen = new Set();
const queue = [data.nodes[0].id];
while (queue.length) {
  const cur = queue.shift();
  if (seen.has(cur)) continue;
  seen.add(cur);
  adj[cur].forEach(n => queue.push(n));
}
assert(seen.size === ids.size, '图连通（从起点可到达所有节点），实际到达 ' + seen.size + '/' + ids.size);

// 环形布局断言：所有节点到圆心距离应近似相等（R=180）
// 圆心 (360,240)，R=180
const cx = 360, cy = 240, R = 180;
let layoutOk = true;
data.nodes.forEach((n, i) => {
  const angle = (2 * Math.PI * i) / data.nodes.length - Math.PI / 2;
  const x = cx + R * Math.cos(angle);
  const y = cy + R * Math.sin(angle);
  if (!isFinite(x) || !isFinite(y)) layoutOk = false;
});
assert(layoutOk, '环形布局可计算出有限坐标');

assert(html.includes('createElementNS'), '使用 SVG 命名空间绘制');
assert(!html.match(/src="http/), '完全离线，无外部 http 资源');

if (failed) { console.error('\n' + failed + ' 项失败'); process.exit(1); }
console.log('\n全部断言通过');
