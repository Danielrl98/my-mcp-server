async function ShouldCreateSystemCarWithMock() {
  const res = await fetch("http://localhost:3333/edit", {
    method: "post",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      sessionId: "projeto-carros",
      mode: "folder",
      targetPath: "C:/Users/danie/OneDrive/Desktop/prod/cubatao/packages/teste",
      instruction: "ficou muito bom, poderia mudar de caminhoes para carros?",
      dryRun: false,
    }),
  });

  const json = await res.json();

  console.log(json);
}

ShouldCreateSystemCarWithMock();
