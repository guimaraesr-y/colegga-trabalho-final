## 📖 Minimundo do Sistema "Colegga"

O sistema **Colegga** é uma plataforma desenvolvida para atender às necessidades de estudantes na modalidade de ensino a distância (EAD). Ele centraliza funcionalidades para gerenciamento acadêmico, organização de tarefas, monitoramento de progresso e interação comunitária. O sistema será composto pelos seguintes módulos e regras:  

### **1. Cadastro de Usuários**
- Cada estudante pode se cadastrar no sistema informando:
  - Nome completo
  - E-mail (que será usado para login e envio de notificações)
  - Senha
- Após o cadastro, o usuário pode personalizar seu perfil, incluindo suas metas de estudo e horários disponíveis.  

---

### **2. Calendário Acadêmico**
- O estudante pode registrar:
  - Aulas e eventos recorrentes (exemplo: "Aula de Matemática toda segunda-feira às 19h").
  - Provas, entregas de trabalhos e atividades pontuais.
- O sistema exibe um calendário visual com eventos destacados e notificações para lembrar o estudante antes de cada evento.

---

### **4. Monitoramento de Progresso**
- Os estudantes podem:
  - Registrar tarefas concluídas (exemplo: "Assistir vídeo-aula de Física").
  - Configurar metas semanais, como “Estudar 10 horas por semana” ou “Ler 2 capítulos de livro por semana”.
- O sistema calcula automaticamente o progresso com base nas metas estabelecidas.

---

### **5. Comunidade Interativa**
- O sistema conta com uma área de comunidade onde:
  - Os estudantes podem postar dúvidas e sugestões.
  - Interagir com outros estudantes respondendo ou curtindo flashes (posts).

---

### **6. Notificações Automatizadas**
- O sistema envia notificações por e-mail com lembretes sobre:
  - Atividades agendadas no calendário.
  - Interações importantes na comunidade (como respostas a perguntas).

---

### **Fluxo de Uso do Sistema**
1. O estudante faz login no Colegga.
2. Ele registra suas aulas, provas e tarefas no calendário.
3. Configura metas de estudo e monitora seu progresso diariamente.
4. Participa da comunidade, interagindo com outros estudantes.
5. Recebe notificações para ajudá-lo a se manter atualizado com seus compromissos e metas.

---

### **Entidades Principais**

1. **Usuário**  
  Representa o estudante cadastrado no sistema. Cada usuário tem acesso ao seu próprio calendário, pode criar metas de estudo e interagir na comunidade.  
  **Atributos principais:**  
    - **ID**: Identificador único do usuário.  
    - **Nome**: Nome completo do estudante.  
    - **E-mail**: Endereço de e-mail usado para login e notificações.  
    - **Senha**: Chave de acesso ao sistema.  

3. **Evento**  
  Um evento é qualquer compromisso registrado no calendário, como aulas, provas ou tarefas.  
  **Atributos principais:**  
    - **ID**: Identificador único do evento.  
    - **Título**: Nome do evento (ex.: "Aula de Matemática").  
    - **Descrição**: Detalhes sobre o evento (ex.: "Aula sobre equações diferenciais").  
    - **Data de Início**: Quando o evento começa.  
    - **Data de Fim**: Quando o evento termina. 

4. **Meta**  
  Representa os objetivos acadêmicos definidos pelo usuário para monitorar seu progresso.  
  **Atributos principais:**  
    - **ID**: Identificador único da meta.  
    - **Usuário**: O estudante que criou a meta.  
    - **Descrição**: O objetivo a ser atingido (ex.: "Ler dois capítulos do livro X").  
    - **Status**: Situação atual da meta (ex.: "Pendente", "Concluída").  
    - **Data de Criação**: Quando a meta foi definida.  
    - **Data de Conclusão**: Quando a meta foi concluída (se aplicável).  

5. **Flash (Postagem)**  
  Um flash é uma interação feita na comunidade do sistema, onde os usuários podem compartilhar dúvidas ou discutir assuntos acadêmicos.  
  **Atributos principais:**  
    - **ID**: Identificador único da postagem.  
    - **Usuário**: Autor da postagem.  
    - **Título**: Resumo da postagem (ex.: "Dúvida sobre cálculo").  
    - **Conteúdo**: Descrição detalhada ou pergunta feita pelo usuário.  
    - **Data de Publicação**: Quando a postagem foi feita.  
    - **Curtidas**: Quantidade de pessoas que curtiram a postagem.  
    - **Respostas**: Lista de respostas associadas à postagem.  

6. **Resposta**  
  Uma resposta é um comentário feito em uma postagem da comunidade.  
  **Atributos principais:**  
    - **ID**: Identificador único da resposta.  
    - **Postagem**: A postagem à qual a resposta pertence.  
    - **Usuário**: Autor da resposta.  
    - **Conteúdo**: Texto da resposta.  
    - **Data de Publicação**: Quando a resposta foi enviada.  

7. **Notificação**  
  Representa mensagens automáticas enviadas para os usuários, como lembretes de eventos ou alertas sobre metas.  
  **Atributos principais:**  
    - **ID**: Identificador único da notificação.  
    - **Usuário**: O destinatário da notificação.   
    - **Mensagem**: Conteúdo da notificação.  
    - **Data de Envio**: Quando a notificação foi enviada.  
    - **Status**: Estado atual (ex.: "Enviada", "Pendente").  