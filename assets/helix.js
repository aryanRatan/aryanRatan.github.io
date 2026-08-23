(function(){
  const ns = "http://www.w3.org/2000/svg";
  const group = document.getElementById('helixGroup');
  if(!group) return;
  const rows = 34;
  const spacing = 24;
  const cx = 300, amp = 90;

  let strandA = "M ";
  const points = [];

  for(let i=0;i<rows;i++){
    const y = i*spacing;
    const t = i/rows;
    const morph = Math.min(1, Math.max(0,(t-0.55))/0.45);
    const wave = Math.sin(i*0.5);
    const smoothX = cx + wave*amp;
    const steppedX = cx + (Math.round(wave)*amp*0.85);
    const x = smoothX*(1-morph) + steppedX*morph;
    points.push({x, y});
    strandA += (i===0? "" : "L ") + x.toFixed(1) + " " + y + " ";
  }

  let strandBpts = points.map(p => ({x: 2*cx - p.x, y: p.y}));
  let strandB = "M " + strandBpts.map(p=>p.x.toFixed(1)+" "+p.y).join(" L ");

  const pathA = document.createElementNS(ns,"path");
  pathA.setAttribute("d", strandA.trim());
  pathA.setAttribute("fill","none");
  pathA.setAttribute("stroke","url(#strandA)");
  pathA.setAttribute("stroke-width","2");
  group.appendChild(pathA);

  const pathB = document.createElementNS(ns,"path");
  pathB.setAttribute("d", strandB);
  pathB.setAttribute("fill","none");
  pathB.setAttribute("stroke","url(#strandB)");
  pathB.setAttribute("stroke-width","2");
  group.appendChild(pathB);

  for(let i=0;i<rows;i+=2){
    const p1 = points[i];
    const p2 = strandBpts[i];
    const line = document.createElementNS(ns,"line");
    line.setAttribute("x1",p1.x); line.setAttribute("y1",p1.y);
    line.setAttribute("x2",p2.x); line.setAttribute("y2",p2.y);
    line.setAttribute("stroke", i % 4 === 0 ? "#4ade80" : "#22d3ee");
    line.setAttribute("stroke-opacity", (0.28 - (i/rows)*0.15).toFixed(2));
    line.setAttribute("stroke-width","1");
    group.appendChild(line);

    if(i/rows > 0.55){
      const via = document.createElementNS(ns,"circle");
      via.setAttribute("cx",p1.x); via.setAttribute("cy",p1.y);
      via.setAttribute("r","2.4");
      via.setAttribute("fill","#4ade80");
      via.setAttribute("opacity","0.5");
      group.appendChild(via);
    }
  }

  group.setAttribute("style","animation: driftHelix 26s ease-in-out infinite;");
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @keyframes driftHelix {
      0%,100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-14px) rotate(0.4deg); }
    }
    @media (prefers-reduced-motion: reduce) {
      #helixGroup { animation: none !important; }
    }
  `;
  document.head.appendChild(styleTag);
})();
