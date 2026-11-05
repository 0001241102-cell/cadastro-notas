
const form = document.getElementById("formAluno");
const nome = document.getElementById("nome");
const nota = document.getElementById("nota");
const listaAlunos = document.getElementById("listaAlunos");
const mensagem = document.getElementById("mensagem");
const pesquisa = document.getElementById("pesquisa");
const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");

let alunos = [];
let alunoEditando = null;

try {
    const dados = JSON.parse(
        localStorage.getItem("alunosEscolares")
    );

    if (Array.isArray(dados)) {
        alunos = dados.map(aluno => ({
            ...aluno,
            nota: String(aluno.nota)
        }));
    }
} catch (erro) {
    alunos = [];
}

function salvarDados() {
    localStorage.setItem(
        "alunosEscolares",
        JSON.stringify(alunos)
    );
}

function mostrarMensagem(texto) {
    mensagem.textContent = texto;
    mensagem.style.color = "green";
}

function limparFormulario() {
    form.reset();
    alunoEditando = null;
    btnSalvar.textContent = "Cadastrar aluno";
    btnCancelar.hidden = true;
}

function mostrarAlunos() {
    listaAlunos.innerHTML = "";

    const busca = pesquisa.value.toLowerCase();

    const filtrados = alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(busca)
    );

    if (filtrados.length === 0) {
        const aviso = document.createElement("p");

        aviso.textContent = alunos.length === 0
            ? "Nenhum aluno cadastrado."
            : "Nenhum aluno encontrado.";

        listaAlunos.appendChild(aviso);
        return;
    }

    filtrados.forEach(aluno => {
        const div = document.createElement("div");
        div.className = "aluno";

        const titulo = document.createElement("h3");
        titulo.textContent = aluno.nome;

        const textoNota = document.createElement("p");
        textoNota.textContent = "Nota: " + aluno.nota;

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.type = "button";

        btnEditar.addEventListener("click", () => {
            editarAluno(aluno.id);
        });

        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.type = "button";
        btnExcluir.className = "btnExcluir";

        btnExcluir.addEventListener("click", () => {
            excluirAluno(aluno.id);
        });

        div.appendChild(titulo);
        div.appendChild(textoNota);
        div.appendChild(btnEditar);
        div.appendChild(btnExcluir);

        listaAlunos.appendChild(div);
    });
}

form.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nomeAluno = nome.value.trim();
    const notaAluno = nota.value.trim();

    if (nomeAluno === "" || notaAluno === "") {
        mostrarMensagem("Preencha todos os campos.");
        return;
    }

    if (alunoEditando !== null) {
        alunos = alunos.map(aluno => {
            if (aluno.id === alunoEditando) {
                return {
                    ...aluno,
                    nome: nomeAluno,
                    nota: notaAluno
                };
            }

            return aluno;
        });

        mostrarMensagem("Aluno atualizado com sucesso!");
    } else {
        alunos.push({
            id: Date.now().toString() +
                Math.random().toString(36).slice(2),
            nome: nomeAluno,
            nota: notaAluno
        });

        mostrarMensagem("Aluno cadastrado com sucesso!");
    }

    salvarDados();
    limparFormulario();
    mostrarAlunos();
});

function editarAluno(id) {
    const aluno = alunos.find(aluno => aluno.id === id);

    if (!aluno) return;

    nome.value = aluno.nome;
    nota.value = aluno.nota;

    alunoEditando = id;

    btnSalvar.textContent = "Salvar alterações";
    btnCancelar.hidden = false;

    nome.focus();
}

function excluirAluno(id) {
    const confirmar = confirm(
        "Deseja realmente excluir este aluno?"
    );

    if (!confirmar) return;

    alunos = alunos.filter(aluno => aluno.id !== id);

    if (alunoEditando === id) {
        limparFormulario();
    }

    salvarDados();
    mostrarAlunos();
    mostrarMensagem("Aluno excluído com sucesso!");
}

btnCancelar.addEventListener("click", function() {
    limparFormulario();
    mostrarMensagem("Edição cancelada.");
});

pesquisa.addEventListener("input", mostrarAlunos);

mostrarAlunos();
