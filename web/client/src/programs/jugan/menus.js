import { createElement } from 'react'

import {
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
  SmileOutlined,
  SendOutlined,
  PoundOutlined,
  RadarChartOutlined,
  RedEnvelopeOutlined,
  ShopOutlined,
  CheckOutlined,
} from '@ant-design/icons'

export const menus = [
  {
    id: '100',
    icon: createElement(HomeOutlined),
    name: '1. 기관관리',
    order: 1,
    children: [
      { id: '111', name: '1-1. 기관정보', order: 1, path: '1/1' },
      { id: '112', name: '1-2. 기관운영', order: 2, path: '1/2' },
    ],
  },
  {
    id: '200',
    icon: createElement(SmileOutlined),
    name: '2. 수급자관리',
    order: 2,
    children: [
      {
        id: '210',
        name: '2-1. 입소관리',
        order: 1,
        children: [
          { id: '211', name: '2-1-1. 수급자정보', order: 1, path: '2/1/1' },
          { id: '212', name: '2-1-2. 급여이용계약', order: 2, path: '2/1/2' },
          { id: '213', name: '2-1-3. 기초평가', order: 3, path: '2/1/3' },
          {
            id: '214',
            name: '2-1-4. 급여제공계획변경',
            order: 4,
            path: '2/1/4',
          },
          { id: '215', name: '2-1-5. 기타비용', order: 5, path: '2/1/5' },
          {
            id: '216',
            name: '2-1-6. 개인정보수집및동의서',
            order: 6,
            path: '2/1/6',
          },
          {
            id: '217',
            name: '2-1-7. 장기요양급여변경사유서',
            order: 7,
            path: '2/1/7',
          },
          {
            id: '218',
            name: '2-1-8. 이동서비스일정',
            order: 8,
            path: '2/1/8',
          },
        ],
      },
      { id: '221', name: '2-2. 급여계획일정', order: 2, path: '2/2' },
      {
        id: '230',
        name: '2-3. 퇴소관리',
        order: 3,
        children: [
          { id: '231', name: '2-3-1. 연계기록지', order: 1, path: '2/3/1' },
          {
            id: '232',
            name: '2-3-2. 장기요양기관퇴소신청',
            order: 2,
            path: '2/3/2',
          },
        ],
      },
    ],
  },
  {
    id: '300',
    icon: createElement(UserOutlined),
    name: '3. 직원관리',
    order: 3,
    children: [
      {
        id: '311',
        name: '3-1. 직원기본정보',
        order: 1,
        path: '3/1',
      },
      {
        id: '320',
        name: '3-2. 근무관리',
        order: 2,
        children: [
          {
            id: '321',
            name: '3-2-1. 근무일정표',
            order: 1,
            path: '3/2/1',
          },
          {
            id: '322',
            name: '3-2-2. 출근/퇴근',
            order: 2,
            path: '3/2/2',
          },
        ],
      },
      {
        id: '331',
        name: '3-3. 증명서발급',
        order: 3,
        path: '3/3',
      },
    ],
  },
  {
    id: '400',
    icon: createElement(SendOutlined),
    name: '4. 위치기반',
    order: 4,
    children: [
      { id: '411', name: '4-1. 출근/퇴근', order: 1, path: '4/1' },
      { id: '412', name: '4-2. 탑승/출석', order: 2, path: '4/2' },
      { id: '413', name: '4-3. 차량관리', order: 3, path: '4/3' },
      { id: '414', name: '4-4. 외출관리', order: 4, path: '4/4' },
    ],
  },
  {
    id: '500',
    icon: createElement(ShopOutlined),
    name: '5. 운영관리',
    order: 5,
    children: [
      {
        id: '510',
        name: '5-1. 이동서비스',
        order: 1,
        children: [
          { id: '511', name: '5-1-1. 수급자월간일정', order: 1, path: '5/1/1' },
          { id: '512', name: '5-1-2. 탑승/출석', order: 2, path: '5/1/2' },
          { id: '513', name: '5-1-3. 수급자월간일정', order: 3, path: '5/1/3' },
        ],
      },
      {
        id: '520',
        name: '5-2. 프로그램',
        order: 2,
        children: [
          { id: '521', name: '5-2-1. 프로그램일정', order: 1, path: '5/2/1' },
          {
            id: '522',
            name: '5-2-2. 프로그램운영일지',
            order: 2,
            path: '5/2/2',
          },
          {
            id: '523',
            name: '5-2-3. 프로그램업무수행일지',
            order: 3,
            path: '5/2/3',
          },
          {
            id: '524',
            name: '5-2-4. 기능회복훅련프로그램',
            order: 4,
            path: '5/2/4',
          },
          { id: '525', name: '5-2-5. 목표및계획', order: 5, path: '5/2/5' },
          { id: '526', name: '5-2-6. 프로그램관리', order: 6, path: '5/2/6' },
        ],
      },
      {
        id: '530',
        name: '5-3. 급여제공기록',
        order: 3,
        children: [
          { id: '531', name: '5-3-1. 급여제공기록지', order: 1, path: '5/3/1' },
          { id: '532', name: '5-3-2. 상태변화기록지', order: 2, path: '5/3/2' },
        ],
      },
      {
        id: '540',
        name: '5-4. 간호관리',
        order: 4,
        children: [
          { id: '541', name: '5-4-1. 바이탈체크', order: 1, path: '5/4/1' },
          { id: '542', name: '5-4-2. 외출관리', order: 2, path: '5/4/2' },
        ],
      },
    ],
  },
  {
    id: '600',
    icon: createElement(PoundOutlined),
    name: '6. 임금관리',
    order: 6,
    children: [
      { id: '611', name: '6-1. 임금설정', order: 1, path: '6/1' },
      { id: '612', name: '6-2. 임금명세서', order: 2, path: '6/2' },
    ],
  },
  {
    id: '700',
    icon: createElement(RadarChartOutlined),
    name: '7. 평가관리',
    order: 7,
    children: [
      { id: '711', name: '7-1. 운영규정', order: 1, path: '7/1' },
      { id: '721', name: '7-2. 급여제공지침', order: 2, path: '7/2' },
      { id: '731', name: '7-3. 직원회의', order: 3, path: '7/3' },
      { id: '741', name: '7-4. 직원복지', order: 4, path: '7/4' },
      { id: '751', name: '7-5. 직무교육', order: 5, path: '7/5' },
      { id: '761', name: '7-6. 상담관리', order: 6, path: '7/6' },
      { id: '771', name: '7-7. 고충처리', order: 7, path: '7/7' },
      { id: '781', name: '7-8. 사례회의', order: 8, path: '7/8' },
      { id: '791', name: '7-9. 기초평가', order: 9, path: '7/9' },
    ],
  },
  {
    id: '800',
    icon: createElement(TeamOutlined),
    name: '8. 자원봉사',
    order: 8,
    children: [
      {
        id: '811',
        name: '8-1. 자원봉사',
        order: 1,
        path: '8/1',
      },
    ],
  },
  {
    id: '900',
    icon: createElement(RedEnvelopeOutlined),
    name: '9. 청구관리',
    order: 9,
    children: [
      { id: '911', name: '9-1. 급여청구관리', order: 1, path: '9/1' },
      { id: '921', name: '9-2. 급여비용정보', order: 2, path: '9/2' },
      { id: '931', name: '9-3. 문자발송관리', order: 3, path: '9/3' },
      { id: '941', name: '9-4. 청구서발송', order: 4, path: '9/4' },
    ],
  },
  {
    id: 'A00',
    icon: createElement(CheckOutlined),
    name: '10. 신규개발',
    order: 10,
    children: [
      { id: 'A11', name: '10-1. 요양요원전송내역비교', order: 1, path: 'A/1' },
      { id: 'A21', name: '10-2. 청구점검', order: 2, path: 'A/2' },
      { id: 'A31', name: '10-3. 일정자동생성', order: 3, path: 'A/3' },
      { id: 'A41', name: '10-4. HealthCare', order: 4, path: 'A/4' },
      { id: 'A51', name: '10-5. 통합공문서관리', order: 5, path: 'A/5' },
      { id: 'A61', name: '10-6. 요양보호사매칭기능', order: 6, path: 'A/6' },
    ],
  },
]
