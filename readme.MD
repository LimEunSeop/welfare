# React + JWT 인증 시스템 + 계층 메뉴 구현

장기요양 프로그램이라는 주제로 React 와 백엔드를 연동하여 간단한 인증시스템과 계층메뉴를 구현해보았습니다. 메뉴를 클릭하면 각 페이지로 이동하는데, 각 페이지는 비어있고, 각 페이지 컴포넌트를 graphQL 과 연동하여 캡슐화하여 개발만 하면 됩니다.

## 프로젝트 요약정보

- 수행기간: 2021년 6월 2주
- 사용기술
  - Front-end: React + Create-React-App, ant-design, Apollo Client(GraphQL Client), Apollo의 Reactive Variable 로 상태관리
  - Back-end: node + typescript, Apollo(GraphQL) + Express(REST API), Prisma + Nexus, JWT 기반 인증

## 요구사항

1. docker 가 필요합니다.
2. 최상위 디렉터리에 `.env` 파일을 추가하여 `docker-compose.prod.yml`에 들어갈 `DB_USER`, `DB_PASS`, `DB_NAME` 이라는 변수를 정의해주어야 합니다.
3. `web/client` 디렉터리에 `.env` 파일을 추가하여 내용 한줄 `SASS_PATH=node_modules:src`을 추가합니다. SCSS가 절대경로를 인식하게 하기 위함입니다.
4. `web/server` 디렉터리에 `.env` 파일을 추가하여 `DATABASE_URL`, `AUTH_SECRET_KEY` 변수를 정의해줍니다. `DATABASE_URL` 은 prisma가 인식하기 위한 DB주소이며, `AUTH_SECRET_KEY`는 JWT 엑세스토큰을 생성하기 위한 시크릿 키입니다.

> 개발환경에서는 `/etc/hosts` 에 `127.0.0.1 docker.for.mac.host.internal` 한줄을 추가해주고, `web/server` 디렉터리의 `.env`에서는 `DATABASE_URL="postgresql://{DB_USER}:{DB_PASS}@docker.for.mac.host.internal:{INTERNAL_PORT}/{DB_NAME}?schema={SCHEMA_NAME}` 같이 도커에서 정의한 주소 형식을 따라주는 것이 좋습니다. 왜냐하면 이 주소는 컨테이너 내의 DB 서비스를 컨테이너 내에서도 접근하고 외부에서도 접근할 수 있기 때문입니다. 현재 DB 컨테이너와 웹서버 컨테이너는 분리돼있습니다. 따라서 localhost 로 서버를 설정할 경우에는 컨테이너 web 에서는 DB 컨테이너를 인식하지 못할 것입니다. 물론 `DATABASE_URL`을 docker-compose 에 명시된 DB 컨테이너 심볼, `db`로 해도 될것입니다. 하지만 소스는 동작하나, container 외부의 개발환경에서 `npx prisma migrate dev` 같은 명령어 및, 여러 디버깅이 편하게 이루어지지 않을 것입니다.

## 실행 방법

개발환경 에서는 `launch.dev.sh` 프로덕션 환경에서는 `launch.prod.sh` 스크립트를 실행합니다.

## 디버깅 하는법

1. `launch.dev.sh`로 개발 컨테이너를 띄웁니다.
2. 컨테이너 적재가 완료됐다면, VSCODE 좌측에 DOCKER 관련 메뉴로 들어가서 `welfare_web` 이라는 컨테이너를 오른쪽 클릭한 'Attach Visual Studio Code' 를 클릭하여 해당 컨테이너 내부를 엽니다.
3. 그 후, VSCODE 디버깅 툴을 열고 디버깅 할 요소(React Client, Web Server)중 하나를 선택하여 자유롭게 디버깅 하면 됩니다.

## 기술 설명

### 데이터 엔티티 리스트

- User(사용자)
  - Boss(시설장)
  - Worker(직원)
- Organization(시설)
- Program(프로그램)
- ProgramSession(시설이 프로그램 이용)

과 같은 구조를 취하고 있습니다.

- User는 Boss일 경우 Organization 을 관리할 수 있어 User와 Organization 은 1:1 의 관계를 취하고 있습니다.
- 한 시설은 여러 프로그램을 이용할 수 있으며, 다른 시설 또한 그러합니다. 따라서 Organization 과 Program은 N:N 의 관계를 취하고 있고 ProgramSession 이 N:N의 관계를 맺어주는 테이블입니다. 이 속에 프로그램 세션만료일 등이 기록돼, 사용기한이 만료되면 과금을 취할 수 있습니다.

### 권한

- 유저 권한으로는 일반 사용자인 user, 중간 관리자인 moderator, 최고관리자인 admin 세가지 권한이 존재합니다.
- user 권한을 가지고 있는 사용자는 Worker 의 권한 또한 가지고 있습니다. Boss 라면 user 중의 최고권한을 가지고 있기 때문에 신경쓸 것이 없지만, 일반 Worker 일 경우에는 보여야될 화면 보이지 말아야할 화면이 존재하기 때문에 이를 통해 권한구분을 해주는 것입니다. (아직 구현돼있지 않습니다)
