// 计算标签在 3D 球面上的位置
document.addEventListener('DOMContentLoaded', function() {
  const tagCloud = document.getElementById('tagCloud');
  const tags = tagCloud.getElementsByTagName('a');
  const radius = 200; // 球面半径（控制标签分布范围）
  
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    // 随机球面坐标（θ: 0-π, φ: 0-2π）
    const theta = Math.acos(-1 + (2 * i) / tags.length);
    const phi = Math.sqrt(tags.length * Math.PI) * theta;
    
    // 转换为 3D 坐标
    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(theta);
    
    // 设置标签位置和旋转
    tag.style.left = `calc(50% + ${x}px)`;
    tag.style.top = `calc(50% + ${y}px)`;
    tag.style.transform = `translate3d(-50%, -50%, ${z}px) rotateY(${phi * 180 / Math.PI}deg)`;
  }
});