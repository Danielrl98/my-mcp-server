async function ShouldCreateSystemCarWithMock() {
  const res = await fetch("http://localhost:3333/edit", {
    method: "post",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      sessionId: "api",
      mode: "folder",
      targetPath: "C:/Users/danie/OneDrive/Desktop/utils/mcp",
      instruction:
        "Leia todo sistema e gere uma documentação completa de como usar o servidor MCPe faça uma apresentação divertida dizendo que foi você que gerou ela",
      dryRun: false,
    }),
  });

  const json = await res.json();

  console.log(json);
}

ShouldCreateSystemCarWithMock();
