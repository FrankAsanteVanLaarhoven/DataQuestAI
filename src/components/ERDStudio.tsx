'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { sound } from '@/lib/audio';
import { sqlLabEngine } from '@/lib/sql-lab-engine';
import {
  ERDEntity,
  ERDAttribute,
  ERDRelationship,
  ERDWaypoint,
  ERDMethod,
  ErdCardinality,
  ErdNotation,
  RoutingStyle,
  LineStyle,
  ArrowheadType,
  DiagramNodeType,
} from '@/lib/types';
import {
  computeConnectionPath,
  generatePlantUml,
  generateMermaid,
} from '@/lib/diagram-routing';
import {
  Network,
  Database,
  Plus,
  Trash2,
  Edit2,
  Key,
  Link as LinkIcon,
  Sparkles,
  RotateCcw,
  Download,
  Copy,
  Check,
  X,
  Code,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Play,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Settings,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  Share2,
  Scissors,
  CornerDownRight,
  GitFork,
  Cpu,
  Server,
  Zap,
  Cloud,
  Sliders,
  Workflow,
  Terminal,
  Activity,
  Boxes,
} from 'lucide-react';

// ============================================================================
// CURATED ARCHITECTURAL TEMPLATES
// ============================================================================

export type DiagramMode = 'relational' | 'uml' | 'distributed';

// 1. Relational Academic Registry (CSC1033 Standard)
const csc1033UniversityTemplate: {
  entities: ERDEntity[];
  relationships: ERDRelationship[];
} = {
  entities: [
    {
      id: 'ent_students',
      name: 'students',
      comment: 'Enrolled undergraduate and postgraduate university students',
      x: 80,
      y: 120,
      color: '#8b5cf6',
      isWeak: false,
      nodeType: 'entity',
      attributes: [
        { id: 'att_s1', name: 'student_id', dataType: 'INT', isPrimaryKey: true, isNullable: false, isUnique: true },
        { id: 'att_s2', name: 'first_name', dataType: 'VARCHAR(100)', isPrimaryKey: false, isNullable: false, isUnique: false },
        { id: 'att_s3', name: 'last_name', dataType: 'VARCHAR(100)', isPrimaryKey: false, isNullable: false, isUnique: false },
        { id: 'att_s4', name: 'email', dataType: 'VARCHAR(255)', isPrimaryKey: false, isNullable: false, isUnique: true },
        { id: 'att_s5', name: 'gpa', dataType: 'DECIMAL(10,2)', isPrimaryKey: false, isNullable: true, isUnique: false },
        { id: 'att_s6', name: 'enrolled_date', dataType: 'DATE', isPrimaryKey: false, isNullable: false, isUnique: false },
      ],
    },
    {
      id: 'ent_departments',
      name: 'departments',
      comment: 'Academic university faculties and research departments',
      x: 880,
      y: 80,
      color: '#06b6d4',
      isWeak: false,
      nodeType: 'entity',
      attributes: [
        { id: 'att_d1', name: 'department_id', dataType: 'INT', isPrimaryKey: true, isNullable: false, isUnique: true },
        { id: 'att_d2', name: 'department_name', dataType: 'VARCHAR(100)', isPrimaryKey: false, isNullable: false, isUnique: true },
        { id: 'att_d3', name: 'building_code', dataType: 'VARCHAR(100)', isPrimaryKey: false, isNullable: true, isUnique: false },
        { id: 'att_d4', name: 'budget', dataType: 'DECIMAL(10,2)', isPrimaryKey: false, isNullable: false, isUnique: false },
      ],
    },
    {
      id: 'ent_professors',
      name: 'professors',
      comment: 'Academic faculty convenors and module lecturers',
      x: 880,
      y: 380,
      color: '#10b981',
      isWeak: false,
      nodeType: 'entity',
      attributes: [
        { id: 'att_p1', name: 'professor_id', dataType: 'INT', isPrimaryKey: true, isNullable: false, isUnique: true },
        { id: 'att_p2', name: 'department_id', dataType: 'INT', isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false },
        { id: 'att_p3', name: 'full_name', dataType: 'VARCHAR(100)', isPrimaryKey: false, isNullable: false, isUnique: false },
        { id: 'att_p4', name: 'office_room', dataType: 'VARCHAR(100)', isPrimaryKey: false, isNullable: true, isUnique: false },
        { id: 'att_p5', name: 'tenured', dataType: 'BOOLEAN', isPrimaryKey: false, isNullable: false, isUnique: false },
      ],
    },
    {
      id: 'ent_courses',
      name: 'courses',
      comment: 'Curriculum modules (e.g. CSC1033 Database Systems)',
      x: 480,
      y: 420,
      color: '#f59e0b',
      isWeak: false,
      nodeType: 'entity',
      attributes: [
        { id: 'att_c1', name: 'course_id', dataType: 'INT', isPrimaryKey: true, isNullable: false, isUnique: true },
        { id: 'att_c2', name: 'professor_id', dataType: 'INT', isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false },
        { id: 'att_c3', name: 'course_code', dataType: 'VARCHAR(100)', isPrimaryKey: false, isNullable: false, isUnique: true },
        { id: 'att_c4', name: 'course_title', dataType: 'VARCHAR(255)', isPrimaryKey: false, isNullable: false, isUnique: false },
        { id: 'att_c5', name: 'credits', dataType: 'INT', isPrimaryKey: false, isNullable: false, isUnique: false },
      ],
    },
    {
      id: 'ent_enrollments',
      name: 'enrollments',
      comment: 'Associative Bridge / Junction Entity resolving M:N Student-Course relation',
      x: 470,
      y: 110,
      color: '#ec4899',
      isWeak: true,
      nodeType: 'entity',
      attributes: [
        { id: 'att_e1', name: 'student_id', dataType: 'INT', isPrimaryKey: true, isForeignKey: true, isNullable: false, isUnique: false },
        { id: 'att_e2', name: 'course_id', dataType: 'INT', isPrimaryKey: true, isForeignKey: true, isNullable: false, isUnique: false },
        { id: 'att_e3', name: 'grade_score', dataType: 'DECIMAL(10,2)', isPrimaryKey: false, isNullable: true, isUnique: false },
        { id: 'att_e4', name: 'semester', dataType: 'VARCHAR(100)', isPrimaryKey: false, isNullable: false, isUnique: false },
        { id: 'att_e5', name: 'status', dataType: 'VARCHAR(100)', isPrimaryKey: false, isNullable: false, isUnique: false },
      ],
    },
  ],
  relationships: [
    {
      id: 'rel_1',
      name: 'belongs_to_dept',
      fromEntityId: 'ent_departments',
      fromAttributeId: 'att_d1',
      toEntityId: 'ent_professors',
      toAttributeId: 'att_p2',
      cardinality: '1:N',
      fromModality: 'mandatory',
      toModality: 'optional',
      isIdentifying: false,
      onDelete: 'RESTRICT',
      routingStyle: 'orthogonal',
      arrowhead: 'crows_foot',
    },
    {
      id: 'rel_2',
      name: 'lectures_course',
      fromEntityId: 'ent_professors',
      fromAttributeId: 'att_p1',
      toEntityId: 'ent_courses',
      toAttributeId: 'att_c2',
      cardinality: '1:N',
      fromModality: 'mandatory',
      toModality: 'optional',
      isIdentifying: false,
      onDelete: 'CASCADE',
      routingStyle: 'orthogonal',
      arrowhead: 'crows_foot',
    },
    {
      id: 'rel_3',
      name: 'student_enrollment',
      fromEntityId: 'ent_students',
      fromAttributeId: 'att_s1',
      toEntityId: 'ent_enrollments',
      toAttributeId: 'att_e1',
      cardinality: '1:N',
      fromModality: 'mandatory',
      toModality: 'optional',
      isIdentifying: true,
      onDelete: 'CASCADE',
      routingStyle: 'orthogonal',
      arrowhead: 'crows_foot',
    },
    {
      id: 'rel_4',
      name: 'course_enrollment',
      fromEntityId: 'ent_courses',
      fromAttributeId: 'att_c1',
      toEntityId: 'ent_enrollments',
      toAttributeId: 'att_e2',
      cardinality: '1:N',
      fromModality: 'mandatory',
      toModality: 'optional',
      isIdentifying: true,
      onDelete: 'CASCADE',
      routingStyle: 'orthogonal',
      arrowhead: 'crows_foot',
    },
  ],
};

// 2. Relational E-Commerce 3NF
const ecommerceTemplate: {
  entities: ERDEntity[];
  relationships: ERDRelationship[];
} = {
  entities: [
    {
      id: 'ent_customers',
      name: 'customers',
      comment: 'Registered retail shoppers',
      x: 80,
      y: 120,
      color: '#3b82f6',
      isWeak: false,
      nodeType: 'entity',
      attributes: [
        { id: 'ec_c1', name: 'customer_id', dataType: 'INT', isPrimaryKey: true, isNullable: false, isUnique: true },
        { id: 'ec_c2', name: 'email', dataType: 'VARCHAR(255)', isPrimaryKey: false, isNullable: false, isUnique: true },
        { id: 'ec_c3', name: 'full_name', dataType: 'VARCHAR(100)', isPrimaryKey: false, isNullable: false, isUnique: false },
        { id: 'ec_c4', name: 'membership_tier', dataType: 'VARCHAR(100)', isPrimaryKey: false, isNullable: false, isUnique: false },
      ],
    },
    {
      id: 'ent_orders',
      name: 'orders',
      comment: 'Financial purchase orders',
      x: 440,
      y: 120,
      color: '#10b981',
      isWeak: false,
      nodeType: 'entity',
      attributes: [
        { id: 'ec_o1', name: 'order_id', dataType: 'INT', isPrimaryKey: true, isNullable: false, isUnique: true },
        { id: 'ec_o2', name: 'customer_id', dataType: 'INT', isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false },
        { id: 'ec_o3', name: 'order_date', dataType: 'TIMESTAMP', isPrimaryKey: false, isNullable: false, isUnique: false },
        { id: 'ec_o4', name: 'total_amount', dataType: 'DECIMAL(10,2)', isPrimaryKey: false, isNullable: false, isUnique: false },
        { id: 'ec_o5', name: 'order_status', dataType: 'VARCHAR(100)', isPrimaryKey: false, isNullable: false, isUnique: false },
      ],
    },
    {
      id: 'ent_order_items',
      name: 'order_items',
      comment: 'Junction table between orders and products (3NF normalized)',
      x: 840,
      y: 120,
      color: '#ec4899',
      isWeak: true,
      nodeType: 'entity',
      attributes: [
        { id: 'ec_oi1', name: 'order_id', dataType: 'INT', isPrimaryKey: true, isForeignKey: true, isNullable: false, isUnique: false },
        { id: 'ec_oi2', name: 'product_id', dataType: 'INT', isPrimaryKey: true, isForeignKey: true, isNullable: false, isUnique: false },
        { id: 'ec_oi3', name: 'quantity', dataType: 'INT', isPrimaryKey: false, isNullable: false, isUnique: false },
        { id: 'ec_oi4', name: 'unit_price', dataType: 'DECIMAL(10,2)', isPrimaryKey: false, isNullable: false, isUnique: false },
      ],
    },
    {
      id: 'ent_products',
      name: 'products',
      comment: 'Catalog SKUs and inventory tracking',
      x: 840,
      y: 400,
      color: '#f59e0b',
      isWeak: false,
      nodeType: 'entity',
      attributes: [
        { id: 'ec_p1', name: 'product_id', dataType: 'INT', isPrimaryKey: true, isNullable: false, isUnique: true },
        { id: 'ec_p2', name: 'product_name', dataType: 'VARCHAR(255)', isPrimaryKey: false, isNullable: false, isUnique: false },
        { id: 'ec_p3', name: 'price', dataType: 'DECIMAL(10,2)', isPrimaryKey: false, isNullable: false, isUnique: false },
        { id: 'ec_p4', name: 'stock_quantity', dataType: 'INT', isPrimaryKey: false, isNullable: false, isUnique: false },
      ],
    },
  ],
  relationships: [
    {
      id: 'rel_ec1',
      name: 'places_order',
      fromEntityId: 'ent_customers',
      fromAttributeId: 'ec_c1',
      toEntityId: 'ent_orders',
      toAttributeId: 'ec_o2',
      cardinality: '1:N',
      fromModality: 'mandatory',
      toModality: 'optional',
      isIdentifying: false,
      onDelete: 'CASCADE',
      routingStyle: 'orthogonal',
      arrowhead: 'crows_foot',
    },
    {
      id: 'rel_ec2',
      name: 'contains_items',
      fromEntityId: 'ent_orders',
      fromAttributeId: 'ec_o1',
      toEntityId: 'ent_order_items',
      toAttributeId: 'ec_oi1',
      cardinality: '1:N',
      fromModality: 'mandatory',
      toModality: 'mandatory',
      isIdentifying: true,
      onDelete: 'CASCADE',
      routingStyle: 'orthogonal',
      arrowhead: 'crows_foot',
    },
    {
      id: 'rel_ec3',
      name: 'product_ordered',
      fromEntityId: 'ent_products',
      fromAttributeId: 'ec_p1',
      toEntityId: 'ent_order_items',
      toAttributeId: 'ec_oi2',
      cardinality: '1:N',
      fromModality: 'mandatory',
      toModality: 'optional',
      isIdentifying: true,
      onDelete: 'RESTRICT',
      routingStyle: 'orthogonal',
      arrowhead: 'crows_foot',
    },
  ],
};

// 3. UML Clean Architecture Domain Model
const umlDomainTemplate: {
  entities: ERDEntity[];
  relationships: ERDRelationship[];
} = {
  entities: [
    {
      id: 'uml_user_controller',
      name: 'UserController',
      comment: 'RESTful API Controller routing user authentication and profiles',
      x: 80,
      y: 120,
      color: '#3b82f6',
      nodeType: 'uml_class',
      stereotype: '<<controller>>',
      attributes: [
        { id: 'u_c1', name: 'userService', dataType: 'UserService', isPrimaryKey: false, isNullable: false, isUnique: false },
      ],
      methods: [
        { id: 'm_c1', name: 'register', returnType: 'Response<UserDTO>', visibility: '+', parameters: 'req: RegisterRequest' },
        { id: 'm_c2', name: 'getProfile', returnType: 'Response<UserDTO>', visibility: '+', parameters: 'id: UUID' },
      ],
    },
    {
      id: 'uml_user_service',
      name: 'UserService',
      comment: 'Core business domain logic and credential validation',
      x: 480,
      y: 120,
      color: '#8b5cf6',
      nodeType: 'uml_class',
      stereotype: '<<service>>',
      attributes: [
        { id: 'u_s1', name: 'userRepo', dataType: 'UserRepository', isPrimaryKey: false, isNullable: false, isUnique: false },
        { id: 'u_s2', name: 'cacheService', dataType: 'CacheService', isPrimaryKey: false, isNullable: false, isUnique: false },
      ],
      methods: [
        { id: 'm_s1', name: 'authenticate', returnType: 'AuthToken', visibility: '+', parameters: 'email: string, pass: string' },
        { id: 'm_s2', name: 'createAccount', returnType: 'UserEntity', visibility: '+', parameters: 'dto: CreateUserDTO' },
      ],
    },
    {
      id: 'uml_user_repo_interface',
      name: 'UserRepository',
      comment: 'Data persistence contract interface (Clean Architecture)',
      x: 480,
      y: 420,
      color: '#06b6d4',
      nodeType: 'uml_class',
      stereotype: '<<interface>>',
      attributes: [],
      methods: [
        { id: 'm_r1', name: 'findById', returnType: 'Optional<UserEntity>', visibility: '+', parameters: 'id: UUID' },
        { id: 'm_r2', name: 'save', returnType: 'UserEntity', visibility: '+', parameters: 'user: UserEntity' },
        { id: 'm_r3', name: 'findByEmail', returnType: 'Optional<UserEntity>', visibility: '+', parameters: 'email: string' },
      ],
    },
    {
      id: 'uml_user_entity',
      name: 'UserEntity',
      comment: 'Domain Model Entity with primary identity',
      x: 880,
      y: 120,
      color: '#10b981',
      nodeType: 'uml_class',
      stereotype: '<<entity>>',
      attributes: [
        { id: 'u_e1', name: 'id', dataType: 'UUID', isPrimaryKey: true, isNullable: false, isUnique: true },
        { id: 'u_e2', name: 'email', dataType: 'string', isPrimaryKey: false, isNullable: false, isUnique: true },
        { id: 'u_e3', name: 'role', dataType: 'UserRole', isPrimaryKey: false, isNullable: false, isUnique: false },
      ],
      methods: [
        { id: 'm_e1', name: 'verifyPassword', returnType: 'boolean', visibility: '+', parameters: 'candidate: string' },
      ],
    },
  ],
  relationships: [
    {
      id: 'rel_uml_1',
      name: 'controller_delegates_service',
      fromEntityId: 'uml_user_controller',
      fromAttributeId: 'u_c1',
      toEntityId: 'uml_user_service',
      toAttributeId: 'u_s1',
      cardinality: '1:1',
      routingStyle: 'orthogonal',
      arrowhead: 'uml_arrow',
      label: 'calls',
    },
    {
      id: 'rel_uml_2',
      name: 'service_uses_repo',
      fromEntityId: 'uml_user_service',
      fromAttributeId: 'u_s1',
      toEntityId: 'uml_user_repo_interface',
      toAttributeId: 'm_r1',
      cardinality: '1:1',
      routingStyle: 'orthogonal',
      arrowhead: 'diamond_open',
      label: 'aggregates',
    },
    {
      id: 'rel_uml_3',
      name: 'service_produces_entity',
      fromEntityId: 'uml_user_service',
      fromAttributeId: 'u_s2',
      toEntityId: 'uml_user_entity',
      toAttributeId: 'u_e1',
      cardinality: '1:N',
      routingStyle: 'orthogonal',
      arrowhead: 'diamond_filled',
      label: 'composes',
    },
  ],
};

// 4. Distributed Event-Driven Cloud Systems Architecture
const distributedCloudTemplate: {
  entities: ERDEntity[];
  relationships: ERDRelationship[];
} = {
  entities: [
    {
      id: 'dist_gateway',
      name: 'Cloudflare / API Gateway',
      comment: 'Global Edge Router with TLS Termination, Rate Limiting & Auth Validation',
      x: 60,
      y: 180,
      color: '#f97316',
      nodeType: 'gateway',
      techBadge: 'Envoy / Edge',
      metrics: { rps: '48.2k req/s', latency: '<3ms', status: 'healthy' },
      attributes: [
        { id: 'dg_1', name: 'port_443', dataType: 'HTTPS', isPrimaryKey: true, isNullable: false, isUnique: true },
        { id: 'dg_2', name: 'rate_limit', dataType: '10k/min', isPrimaryKey: false, isNullable: false, isUnique: false },
      ],
    },
    {
      id: 'dist_auth',
      name: 'Auth Microservice',
      comment: 'OAuth2 / JWT Token Issuer & RBAC Permission Authority',
      x: 440,
      y: 60,
      color: '#8b5cf6',
      nodeType: 'microservice',
      techBadge: 'Go / OAuth2',
      metrics: { rps: '12.4k req/s', latency: '5ms', status: 'healthy' },
      attributes: [
        { id: 'da_1', name: 'grpc_port_50051', dataType: 'Protobuf', isPrimaryKey: true, isNullable: false, isUnique: true },
      ],
    },
    {
      id: 'dist_order',
      name: 'Order Processing Engine',
      comment: 'High-throughput transactional order execution and state machine',
      x: 440,
      y: 300,
      color: '#3b82f6',
      nodeType: 'microservice',
      techBadge: 'Rust / Tokio',
      metrics: { rps: '18.5k req/s', latency: '12ms', status: 'healthy' },
      attributes: [
        { id: 'do_1', name: 'http_port_8080', dataType: 'REST', isPrimaryKey: true, isNullable: false, isUnique: true },
      ],
    },
    {
      id: 'dist_kafka',
      name: 'Apache Kafka Event Bus',
      comment: 'Distributed partitioned commit log for asynchronous event streams',
      x: 820,
      y: 300,
      color: '#ec4899',
      nodeType: 'queue',
      techBadge: 'Kafka 3.7',
      metrics: { rps: '95.0k msg/s', latency: '<2ms', status: 'healthy' },
      attributes: [
        { id: 'dk_1', name: 'topic_orders_placed', dataType: 'Avro Event', isPrimaryKey: true, isNullable: false, isUnique: true },
        { id: 'dk_2', name: 'topic_payments_success', dataType: 'Avro Event', isPrimaryKey: false, isNullable: false, isUnique: true },
      ],
    },
    {
      id: 'dist_db',
      name: 'PostgreSQL Multi-AZ Cluster',
      comment: 'ACID Relational Storage with Read Replicas & pgBouncer Pooling',
      x: 1200,
      y: 120,
      color: '#10b981',
      nodeType: 'database',
      techBadge: 'Postgres 16',
      metrics: { rps: '24.2k iops', latency: '<4ms', status: 'healthy' },
      attributes: [
        { id: 'ddb_1', name: 'port_5432', dataType: 'SQL Pool', isPrimaryKey: true, isNullable: false, isUnique: true },
      ],
    },
    {
      id: 'dist_redis',
      name: 'Redis In-Memory Cluster',
      comment: 'Sub-millisecond Session & Catalog Cache Layer (Cache-Aside)',
      x: 1200,
      y: 380,
      color: '#ef4444',
      nodeType: 'cache',
      techBadge: 'Redis 7.2',
      metrics: { rps: '185k ops/s', latency: '<1ms', status: 'healthy' },
      attributes: [
        { id: 'dr_1', name: 'port_6379', dataType: 'In-Memory', isPrimaryKey: true, isNullable: false, isUnique: true },
      ],
    },
  ],
  relationships: [
    {
      id: 'rel_dist_1',
      name: 'gateway_auth_grpc',
      fromEntityId: 'dist_gateway',
      fromAttributeId: 'dg_1',
      toEntityId: 'dist_auth',
      toAttributeId: 'da_1',
      cardinality: '1:1',
      routingStyle: 'orthogonal',
      lineStyle: 'solid',
      arrowhead: 'async_arrow',
      protocol: 'gRPC / Mutual TLS',
    },
    {
      id: 'rel_dist_2',
      name: 'gateway_orders_rest',
      fromEntityId: 'dist_gateway',
      fromAttributeId: 'dg_1',
      toEntityId: 'dist_order',
      toAttributeId: 'do_1',
      cardinality: '1:1',
      routingStyle: 'orthogonal',
      lineStyle: 'solid',
      arrowhead: 'async_arrow',
      protocol: 'HTTPS / REST (v2)',
    },
    {
      id: 'rel_dist_3',
      name: 'orders_publish_kafka',
      fromEntityId: 'dist_order',
      fromAttributeId: 'do_1',
      toEntityId: 'dist_kafka',
      toAttributeId: 'dk_1',
      cardinality: '1:N',
      routingStyle: 'orthogonal',
      lineStyle: 'dashed',
      arrowhead: 'async_arrow',
      protocol: 'Async Event Stream',
    },
    {
      id: 'rel_dist_4',
      name: 'auth_db_sync',
      fromEntityId: 'dist_auth',
      fromAttributeId: 'da_1',
      toEntityId: 'dist_db',
      toAttributeId: 'ddb_1',
      cardinality: '1:N',
      routingStyle: 'orthogonal',
      lineStyle: 'solid',
      arrowhead: 'uml_arrow',
      protocol: 'pgBouncer Pool',
    },
    {
      id: 'rel_dist_5',
      name: 'order_cache_aside',
      fromEntityId: 'dist_order',
      fromAttributeId: 'do_1',
      toEntityId: 'dist_redis',
      toAttributeId: 'dr_1',
      cardinality: '1:N',
      routingStyle: 'orthogonal',
      lineStyle: 'dashed',
      arrowhead: 'async_arrow',
      protocol: 'Sub-ms Read/Write',
    },
  ],
};

export const ERDStudio: React.FC = () => {
  const { setActiveTab, awardXp } = useAppStore();

  // Mode: Relational ERD vs UML Class Diagram vs Distributed Systems Architecture
  const [diagramMode, setDiagramMode] = useState<DiagramMode>('relational');

  // Core Data States
  const [entities, setEntities] = useState<ERDEntity[]>(csc1033UniversityTemplate.entities);
  const [relationships, setRelationships] = useState<ERDRelationship[]>(csc1033UniversityTemplate.relationships);
  const [notation, setNotation] = useState<ErdNotation>('crows_foot');
  const [defaultRoutingStyle, setDefaultRoutingStyle] = useState<RoutingStyle>('orthogonal');

  // Canvas Viewport & Pan/Zoom
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const startPanRef = useRef({ x: 0, y: 0 });

  // Selection & Inspector
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | null>(null);

  // Wire Connection States (Click & Drag & Release)
  const [connectingFrom, setConnectingFrom] = useState<{
    entityId: string;
    attributeId: string;
    x: number;
    y: number;
  } | null>(null);
  const [dragMousePos, setDragMousePos] = useState<{ x: number; y: number } | null>(null);

  // Interactive Endpoint Re-routing (Click, Drag & Release Existing Arrow Ends)
  const [relinking, setRelinking] = useState<{
    relationshipId: string;
    end: 'from' | 'to';
  } | null>(null);

  // Dragging Waypoint State (Bending Elbows / Angles)
  const [draggingWaypoint, setDraggingWaypoint] = useState<{
    relationshipId: string;
    waypointId: string;
  } | null>(null);

  // Modals & Panels
  const [isEntityModalOpen, setIsEntityModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<ERDEntity | null>(null);
  const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
  const [editingAttributeEntityId, setEditingAttributeEntityId] = useState<string | null>(null);
  const [editingAttribute, setEditingAttribute] = useState<ERDAttribute | null>(null);

  // Inline Direct-Typing State (Click / Double-Click on canvas to rename)
  const [inlineEditing, setInlineEditing] = useState<{
    type: 'entityName' | 'attrName' | 'attrType' | 'relLabel' | 'methodName';
    entityId?: string;
    attrId?: string;
    relId?: string;
    methodId?: string;
  } | null>(null);

  // Export Modal (SQL, PlantUML, Mermaid, JSON)
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTab, setExportTab] = useState<'sql' | 'plantuml' | 'mermaid' | 'json'>('sql');
  const [copiedCode, setCopiedCode] = useState(false);
  const [sqlSyncSuccess, setSqlSyncSuccess] = useState<string | null>(null);

  // Internal Clipboard for Copy & Paste
  const clipboardEntityRef = useRef<ERDEntity | null>(null);

  // Dragging Entity State
  const [draggingEntityId, setDraggingEntityId] = useState<string | null>(null);
  const dragEntityOffsetRef = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Selected Entity accessor
  const selectedEntity = useMemo(
    () => entities.find((e) => e.id === selectedEntityId) || null,
    [entities, selectedEntityId]
  );

  // Selected Relationship accessor
  const selectedRelationship = useMemo(
    () => relationships.find((r) => r.id === selectedRelationshipId) || null,
    [relationships, selectedRelationshipId]
  );

  // --------------------------------------------------------------------------
  // Keyboard Shortcuts (Delete, Duplicate, Copy, Paste, Escape)
  // --------------------------------------------------------------------------

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input, textarea, or select
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          activeEl.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      // Delete / Backspace: Delete selected entity or relationship
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedRelationshipId) {
          e.preventDefault();
          handleDeleteRelationship(selectedRelationshipId);
        } else if (selectedEntityId) {
          e.preventDefault();
          handleDeleteEntity(selectedEntityId);
        }
      }

      // Cmd+D / Ctrl+D: Duplicate selected element
      if ((e.metaKey || e.ctrlKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        if (selectedEntityId) {
          handleDuplicateEntity(selectedEntityId);
        } else if (selectedRelationshipId) {
          handleDuplicateRelationship(selectedRelationshipId);
        }
      }

      // Cmd+C / Ctrl+C: Copy selected entity
      if ((e.metaKey || e.ctrlKey) && (e.key === 'c' || e.key === 'C')) {
        if (selectedEntity) {
          clipboardEntityRef.current = JSON.parse(JSON.stringify(selectedEntity));
          sound.playClick();
        }
      }

      // Cmd+V / Ctrl+V: Paste copied entity
      if ((e.metaKey || e.ctrlKey) && (e.key === 'v' || e.key === 'V')) {
        if (clipboardEntityRef.current) {
          e.preventDefault();
          handlePasteEntity();
        }
      }

      // Escape: Deselect everything
      if (e.key === 'Escape') {
        setSelectedEntityId(null);
        setSelectedRelationshipId(null);
        setConnectingFrom(null);
        setRelinking(null);
        setDraggingWaypoint(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEntityId, selectedRelationshipId, selectedEntity, entities]);

  // --------------------------------------------------------------------------
  // Dragging, Panning & Canvas Mouse Handlers
  // --------------------------------------------------------------------------

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Only pan if clicking empty canvas background or plain SVG area
    if (e.target === canvasRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsPanning(true);
      startPanRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
      setSelectedEntityId(null);
      setSelectedRelationshipId(null);
      setRelinking(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const currentMousePos = {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom,
    };

    if (isPanning) {
      setPan({
        x: e.clientX - startPanRef.current.x,
        y: e.clientY - startPanRef.current.y,
      });
      return;
    }

    // Dragging an entity card
    if (draggingEntityId) {
      const rawX = currentMousePos.x - dragEntityOffsetRef.current.x;
      const rawY = currentMousePos.y - dragEntityOffsetRef.current.y;

      // Magnetic snap to 10px grid
      const snapX = Math.round(rawX / 10) * 10;
      const snapY = Math.round(rawY / 10) * 10;

      setEntities((prev) =>
        prev.map((ent) =>
          ent.id === draggingEntityId
            ? { ...ent, x: Math.max(10, snapX), y: Math.max(10, snapY) }
            : ent
        )
      );
      return;
    }

    // Dragging connection wire (creation)
    if (connectingFrom) {
      setDragMousePos(currentMousePos);
      return;
    }

    // Dragging relationship endpoint (re-linking)
    if (relinking) {
      setDragMousePos(currentMousePos);
      return;
    }

    // Dragging waypoint (angle bend point)
    if (draggingWaypoint) {
      const snapX = Math.round(currentMousePos.x / 10) * 10;
      const snapY = Math.round(currentMousePos.y / 10) * 10;

      setRelationships((prev) =>
        prev.map((rel) => {
          if (rel.id !== draggingWaypoint.relationshipId) return rel;
          const updatedWaypoints = (rel.waypoints || []).map((wp) =>
            wp.id === draggingWaypoint.waypointId ? { ...wp, x: snapX, y: snapY } : wp
          );
          return { ...rel, waypoints: updatedWaypoints };
        })
      );
      return;
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
    setDraggingEntityId(null);
    if (connectingFrom) {
      setConnectingFrom(null);
      setDragMousePos(null);
    }
    if (relinking) {
      setRelinking(null);
      setDragMousePos(null);
    }
    if (draggingWaypoint) {
      setDraggingWaypoint(null);
    }
  };

  const startDraggingEntity = (e: React.MouseEvent, ent: ERDEntity) => {
    e.stopPropagation();
    sound.playClick();
    setSelectedEntityId(ent.id);
    setSelectedRelationshipId(null);
    setDraggingEntityId(ent.id);

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const currentMouseX = (e.clientX - rect.left - pan.x) / zoom;
      const currentMouseY = (e.clientY - rect.top - pan.y) / zoom;
      dragEntityOffsetRef.current = {
        x: currentMouseX - ent.x,
        y: currentMouseY - ent.y,
      };
    }
  };

  // --------------------------------------------------------------------------
  // Interactive Port Connector (Wire Drawing & Re-routing)
  // --------------------------------------------------------------------------

  const handleStartConnect = (e: React.MouseEvent, entityId: string, attributeId: string) => {
    e.stopPropagation();
    sound.playSnap();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const sourceEntity = entities.find((ent) => ent.id === entityId);
    if (!sourceEntity) return;

    const attrIndex = sourceEntity.attributes.findIndex((a) => a.id === attributeId);
    const portX = sourceEntity.x + 240;
    const portY = sourceEntity.y + 60 + Math.max(0, attrIndex) * 28;

    setConnectingFrom({
      entityId,
      attributeId,
      x: portX,
      y: portY,
    });
    setDragMousePos({
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom,
    });
  };

  const handleDropOnPort = (e: React.MouseEvent, targetEntityId: string, targetAttributeId: string) => {
    e.stopPropagation();

    // 1. If currently creating a new wire
    if (connectingFrom) {
      if (connectingFrom.entityId === targetEntityId) {
        setConnectingFrom(null);
        setDragMousePos(null);
        return;
      }

      sound.playSuccess();
      const sourceEnt = entities.find((ent) => ent.id === connectingFrom.entityId);
      const targetEnt = entities.find((ent) => ent.id === targetEntityId);
      const sourceAttr = sourceEnt?.attributes.find((a) => a.id === connectingFrom.attributeId);
      const targetAttr = targetEnt?.attributes.find((a) => a.id === targetAttributeId);

      let defaultCard: ErdCardinality = '1:N';
      if (sourceAttr?.isPrimaryKey && targetAttr?.isPrimaryKey) {
        defaultCard = '1:1';
      }

      // Auto-mark target column as foreign key if not already PK
      if (targetAttr && !targetAttr.isPrimaryKey) {
        setEntities((prev) =>
          prev.map((ent) =>
            ent.id === targetEntityId
              ? {
                  ...ent,
                  attributes: ent.attributes.map((att) =>
                    att.id === targetAttributeId
                      ? {
                          ...att,
                          isForeignKey: true,
                          references: {
                            entityId: connectingFrom.entityId,
                            attributeId: connectingFrom.attributeId,
                            tableName: sourceEnt?.name,
                            columnName: sourceAttr?.name,
                          },
                        }
                      : att
                  ),
                }
              : ent
          )
        );
      }

      const newRel: ERDRelationship = {
        id: 'rel_' + Math.random().toString(36).substring(2, 8),
        name: `${sourceEnt?.name}_to_${targetEnt?.name}`,
        fromEntityId: connectingFrom.entityId,
        fromAttributeId: connectingFrom.attributeId,
        toEntityId: targetEntityId,
        toAttributeId: targetAttributeId,
        cardinality: defaultCard,
        fromModality: 'mandatory',
        toModality: 'optional',
        isIdentifying: targetAttr?.isPrimaryKey || false,
        onDelete: 'CASCADE',
        routingStyle: defaultRoutingStyle,
        arrowhead: diagramMode === 'uml' ? 'uml_arrow' : 'crows_foot',
      };

      setRelationships((prev) => [...prev, newRel]);
      setSelectedRelationshipId(newRel.id);
      setConnectingFrom(null);
      setDragMousePos(null);
      awardXp(25, 'Connected Relational Foreign Key');
      return;
    }

    // 2. If currently re-linking an existing relationship endpoint
    if (relinking) {
      sound.playSuccess();
      setRelationships((prev) =>
        prev.map((r) => {
          if (r.id !== relinking.relationshipId) return r;
          if (relinking.end === 'from') {
            return {
              ...r,
              fromEntityId: targetEntityId,
              fromAttributeId: targetAttributeId,
            };
          } else {
            return {
              ...r,
              toEntityId: targetEntityId,
              toAttributeId: targetAttributeId,
            };
          }
        })
      );
      setRelinking(null);
      setDragMousePos(null);
      awardXp(20, 'Re-routed Architecture Link');
      return;
    }
  };

  // --------------------------------------------------------------------------
  // Angle Splitting & Waypoint Controls (Elbows / Multi-angle routing)
  // --------------------------------------------------------------------------

  const handleAddWaypoint = (relId: string, point?: { x: number; y: number }) => {
    sound.playSnap();
    setRelationships((prev) =>
      prev.map((rel) => {
        if (rel.id !== relId) return rel;

        const fromEnt = entities.find((e) => e.id === rel.fromEntityId);
        const toEnt = entities.find((e) => e.id === rel.toEntityId);
        const defaultMidX = fromEnt && toEnt ? (fromEnt.x + toEnt.x) / 2 + 120 : 300;
        const defaultMidY = fromEnt && toEnt ? (fromEnt.y + toEnt.y) / 2 + 60 : 300;

        const newWp: ERDWaypoint = {
          id: 'wp_' + Math.random().toString(36).substring(2, 8),
          x: point ? point.x : defaultMidX,
          y: point ? point.y : defaultMidY,
        };

        return {
          ...rel,
          waypoints: [...(rel.waypoints || []), newWp],
        };
      })
    );
    awardXp(10, 'Split Arrow Angle & Added Waypoint');
  };

  const handleDeleteWaypoint = (relId: string, wpId: string) => {
    sound.playClick();
    setRelationships((prev) =>
      prev.map((rel) =>
        rel.id === relId
          ? {
              ...rel,
              waypoints: (rel.waypoints || []).filter((wp) => wp.id !== wpId),
            }
          : rel
      )
    );
  };

  // --------------------------------------------------------------------------
  // Node / Relationship CRUD, Duplication & Clipboard
  // --------------------------------------------------------------------------

  const handleDuplicateEntity = (entityId: string) => {
    const target = entities.find((e) => e.id === entityId);
    if (!target) return;
    sound.playSuccess();

    const clone: ERDEntity = {
      ...JSON.parse(JSON.stringify(target)),
      id: 'ent_' + Math.random().toString(36).substring(2, 8),
      name: `${target.name}_copy`,
      x: target.x + 40,
      y: target.y + 40,
      attributes: target.attributes.map((a) => ({
        ...a,
        id: 'att_' + Math.random().toString(36).substring(2, 8),
      })),
    };

    setEntities((prev) => [...prev, clone]);
    setSelectedEntityId(clone.id);
    awardXp(15, 'Duplicated Architecture Entity');
  };

  const handlePasteEntity = () => {
    if (!clipboardEntityRef.current) return;
    sound.playSuccess();
    const source = clipboardEntityRef.current;

    const clone: ERDEntity = {
      ...JSON.parse(JSON.stringify(source)),
      id: 'ent_' + Math.random().toString(36).substring(2, 8),
      name: `${source.name}_pasted`,
      x: source.x + 50,
      y: source.y + 50,
      attributes: source.attributes.map((a) => ({
        ...a,
        id: 'att_' + Math.random().toString(36).substring(2, 8),
      })),
    };

    setEntities((prev) => [...prev, clone]);
    setSelectedEntityId(clone.id);
    awardXp(15, 'Pasted Entity Architecture');
  };

  const handleDeleteEntity = (entityId: string) => {
    sound.playError();
    setEntities((prev) => prev.filter((e) => e.id !== entityId));
    setRelationships((prev) =>
      prev.filter((r) => r.fromEntityId !== entityId && r.toEntityId !== entityId)
    );
    if (selectedEntityId === entityId) setSelectedEntityId(null);
  };

  const handleDuplicateRelationship = (relId: string) => {
    const target = relationships.find((r) => r.id === relId);
    if (!target) return;
    sound.playSuccess();

    const clone: ERDRelationship = {
      ...JSON.parse(JSON.stringify(target)),
      id: 'rel_' + Math.random().toString(36).substring(2, 8),
      name: `${target.name}_copy`,
      waypoints: (target.waypoints || []).map((wp) => ({
        ...wp,
        id: 'wp_' + Math.random().toString(36).substring(2, 8),
        y: wp.y + 30,
      })),
    };

    setRelationships((prev) => [...prev, clone]);
    setSelectedRelationshipId(clone.id);
    awardXp(15, 'Duplicated Architecture Arrow');
  };

  const handleReverseRelationship = (relId: string) => {
    sound.playSnap();
    setRelationships((prev) =>
      prev.map((r) => {
        if (r.id !== relId) return r;
        return {
          ...r,
          fromEntityId: r.toEntityId,
          fromAttributeId: r.toAttributeId,
          toEntityId: r.fromEntityId,
          toAttributeId: r.fromAttributeId,
          cardinality:
            r.cardinality === '1:N'
              ? 'N:1'
              : r.cardinality === 'N:1'
              ? '1:N'
              : r.cardinality,
        };
      })
    );
  };

  const handleDeleteRelationship = (relId: string) => {
    sound.playError();
    setRelationships((prev) => prev.filter((r) => r.id !== relId));
    if (selectedRelationshipId === relId) setSelectedRelationshipId(null);
  };

  // --------------------------------------------------------------------------
  // Direct Typing & Rename Handlers (Live Canvas & Inspector Editing)
  // --------------------------------------------------------------------------

  const handleRenameEntity = (id: string, newName: string) => {
    const clean =
      diagramMode === 'relational'
        ? newName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_')
        : newName.trim().replace(/[^a-zA-Z0-9_]/g, '');
    if (!clean) return;
    setEntities((prev) => prev.map((e) => (e.id === id ? { ...e, name: clean } : e)));
  };

  const handleUpdateEntityComment = (id: string, comment: string) => {
    setEntities((prev) => prev.map((e) => (e.id === id ? { ...e, comment } : e)));
  };

  const handleUpdateEntityStereotype = (id: string, val: string) => {
    setEntities((prev) =>
      prev.map((e) => (e.id === id ? { ...e, stereotype: val, techBadge: val } : e))
    );
  };

  const handleRenameAttribute = (entityId: string, attrId: string, newName: string) => {
    const clean =
      diagramMode === 'relational'
        ? newName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_')
        : newName.trim().replace(/[^a-zA-Z0-9_]/g, '');
    if (!clean) return;
    setEntities((prev) =>
      prev.map((e) => {
        if (e.id !== entityId) return e;
        return {
          ...e,
          attributes: e.attributes.map((a) => (a.id === attrId ? { ...a, name: clean } : a)),
        };
      })
    );
  };

  const handleChangeAttributeType = (entityId: string, attrId: string, newType: string) => {
    setEntities((prev) =>
      prev.map((e) => {
        if (e.id !== entityId) return e;
        return {
          ...e,
          attributes: e.attributes.map((a) => (a.id === attrId ? { ...a, dataType: newType } : a)),
        };
      })
    );
  };

  const handleRenameRelationship = (relId: string, newName: string) => {
    setRelationships((prev) =>
      prev.map((r) => (r.id === relId ? { ...r, name: newName } : r))
    );
  };

  const handleUpdateRelationshipProtocol = (relId: string, val: string) => {
    setRelationships((prev) =>
      prev.map((r) => (r.id === relId ? { ...r, protocol: val, label: val } : r))
    );
  };

  const handleRenameMethod = (entityId: string, methodId: string, newName: string) => {
    setEntities((prev) =>
      prev.map((e) => {
        if (e.id !== entityId) return e;
        return {
          ...e,
          methods: (e.methods || []).map((m) => (m.id === methodId ? { ...m, name: newName } : m)),
        };
      })
    );
  };

  // --------------------------------------------------------------------------
  // Entity & Attribute Modal Handlers
  // --------------------------------------------------------------------------

  const handleOpenAddEntity = () => {
    sound.playClick();
    const isUml = diagramMode === 'uml';
    const isDist = diagramMode === 'distributed';

    setEditingEntity({
      id: 'ent_' + Math.random().toString(36).substring(2, 8),
      name: isDist ? 'NewMicroservice' : isUml ? 'NewDomainClass' : 'new_table',
      comment: isDist ? 'Distributed Cloud Service' : isUml ? 'UML Domain Object' : 'Relational table',
      x: Math.max(50, -pan.x + 200),
      y: Math.max(50, -pan.y + 150),
      color: isDist ? '#f97316' : isUml ? '#3b82f6' : '#6366f1',
      isWeak: false,
      nodeType: isDist ? 'microservice' : isUml ? 'uml_class' : 'entity',
      stereotype: isUml ? '<<service>>' : undefined,
      techBadge: isDist ? 'Go / REST' : undefined,
      metrics: isDist ? { rps: '10.0k req/s', latency: '<5ms', status: 'healthy' } : undefined,
      attributes: [
        {
          id: 'att_' + Math.random().toString(36).substring(2, 8),
          name: isDist ? 'http_port_8080' : 'id',
          dataType: isDist ? 'TCP' : isUml ? 'UUID' : 'INT',
          isPrimaryKey: true,
          isNullable: false,
          isUnique: true,
        },
      ],
      methods: isUml
        ? [
            {
              id: 'm_' + Math.random().toString(36).substring(2, 8),
              name: 'execute',
              returnType: 'Result',
              visibility: '+',
              parameters: 'req: Request',
            },
          ]
        : undefined,
    });
    setIsEntityModalOpen(true);
  };

  const handleSaveEntity = () => {
    if (!editingEntity || !editingEntity.name.trim()) return;
    sound.playSuccess();
    const cleanName =
      diagramMode === 'relational'
        ? editingEntity.name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_')
        : editingEntity.name.trim().replace(/[^a-zA-Z0-9_]/g, '');

    setEntities((prev) => {
      const exists = prev.some((e) => e.id === editingEntity.id);
      if (exists) {
        return prev.map((e) => (e.id === editingEntity.id ? { ...editingEntity, name: cleanName } : e));
      }
      return [...prev, { ...editingEntity, name: cleanName }];
    });

    setIsEntityModalOpen(false);
    setSelectedEntityId(editingEntity.id);
    awardXp(15, 'Configured System Entity');
  };

  const handleOpenAddAttribute = (entityId: string) => {
    sound.playClick();
    setEditingAttributeEntityId(entityId);
    setEditingAttribute({
      id: 'att_' + Math.random().toString(36).substring(2, 8),
      name: diagramMode === 'relational' ? 'column_name' : 'field_name',
      dataType: 'VARCHAR(100)',
      isPrimaryKey: false,
      isForeignKey: false,
      isNullable: true,
      isUnique: false,
    });
    setIsAttributeModalOpen(true);
  };

  const handleSaveAttribute = () => {
    if (!editingAttribute || !editingAttributeEntityId || !editingAttribute.name.trim()) return;
    sound.playSuccess();
    const cleanName =
      diagramMode === 'relational'
        ? editingAttribute.name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_')
        : editingAttribute.name.trim();

    setEntities((prev) =>
      prev.map((ent) => {
        if (ent.id !== editingAttributeEntityId) return ent;
        const exists = ent.attributes.some((a) => a.id === editingAttribute.id);
        const updatedAttrs = exists
          ? ent.attributes.map((a) => (a.id === editingAttribute.id ? { ...editingAttribute, name: cleanName } : a))
          : [...ent.attributes, { ...editingAttribute, name: cleanName }];
        return { ...ent, attributes: updatedAttrs };
      })
    );

    setIsAttributeModalOpen(false);
    setEditingAttribute(null);
    awardXp(10, 'Configured Attribute Column');
  };

  const handleDeleteAttribute = (entityId: string, attributeId: string) => {
    sound.playClick();
    setEntities((prev) =>
      prev.map((ent) =>
        ent.id === entityId ? { ...ent, attributes: ent.attributes.filter((a) => a.id !== attributeId) } : ent
      )
    );
    setRelationships((prev) =>
      prev.filter((r) => r.fromAttributeId !== attributeId && r.toAttributeId !== attributeId)
    );
  };

  // --------------------------------------------------------------------------
  // 3NF Many-to-Many Normalization Decomposition
  // --------------------------------------------------------------------------

  const handleDecomposeManyToMany = (relId: string) => {
    const rel = relationships.find((r) => r.id === relId);
    if (!rel) return;

    const fromEnt = entities.find((e) => e.id === rel.fromEntityId);
    const toEnt = entities.find((e) => e.id === rel.toEntityId);
    if (!fromEnt || !toEnt) return;

    sound.playLevelUp();
    const junctionName = `${fromEnt.name}_${toEnt.name}_map`;
    const junctionId = 'ent_junc_' + Math.random().toString(36).substring(2, 7);

    const fromPk = fromEnt.attributes.find((a) => a.isPrimaryKey) || fromEnt.attributes[0];
    const toPk = toEnt.attributes.find((a) => a.isPrimaryKey) || toEnt.attributes[0];

    const junctionEntity: ERDEntity = {
      id: junctionId,
      name: junctionName,
      comment: `Associative Junction entity resolving M:N relationship between ${fromEnt.name} and ${toEnt.name}`,
      x: (fromEnt.x + toEnt.x) / 2,
      y: (fromEnt.y + toEnt.y) / 2 + 50,
      color: '#ec4899',
      isWeak: true,
      nodeType: 'entity',
      attributes: [
        {
          id: 'junc_att_' + Math.random().toString(36).substring(2, 6),
          name: `${fromEnt.name}_${fromPk.name}`,
          dataType: fromPk.dataType,
          isPrimaryKey: true,
          isForeignKey: true,
          isNullable: false,
          isUnique: false,
          references: { entityId: fromEnt.id, attributeId: fromPk.id, tableName: fromEnt.name, columnName: fromPk.name },
        },
        {
          id: 'junc_att_' + Math.random().toString(36).substring(2, 6),
          name: `${toEnt.name}_${toPk.name}`,
          dataType: toPk.dataType,
          isPrimaryKey: true,
          isForeignKey: true,
          isNullable: false,
          isUnique: false,
          references: { entityId: toEnt.id, attributeId: toPk.id, tableName: toEnt.name, columnName: toPk.name },
        },
        {
          id: 'junc_att_' + Math.random().toString(36).substring(2, 6),
          name: 'created_at',
          dataType: 'TIMESTAMP',
          isPrimaryKey: false,
          isNullable: false,
          isUnique: false,
        },
      ],
    };

    const rel1: ERDRelationship = {
      id: 'rel_' + Math.random().toString(36).substring(2, 8),
      name: `${fromEnt.name}_to_junction`,
      fromEntityId: fromEnt.id,
      fromAttributeId: fromPk.id,
      toEntityId: junctionId,
      toAttributeId: junctionEntity.attributes[0].id,
      cardinality: '1:N',
      fromModality: 'mandatory',
      toModality: 'optional',
      isIdentifying: true,
      onDelete: 'CASCADE',
      routingStyle: 'orthogonal',
      arrowhead: 'crows_foot',
    };

    const rel2: ERDRelationship = {
      id: 'rel_' + Math.random().toString(36).substring(2, 8),
      name: `${toEnt.name}_to_junction`,
      fromEntityId: toEnt.id,
      fromAttributeId: toPk.id,
      toEntityId: junctionId,
      toAttributeId: junctionEntity.attributes[1].id,
      cardinality: '1:N',
      fromModality: 'mandatory',
      toModality: 'optional',
      isIdentifying: true,
      onDelete: 'CASCADE',
      routingStyle: 'orthogonal',
      arrowhead: 'crows_foot',
    };

    setEntities((prev) => [...prev, junctionEntity]);
    setRelationships((prev) => [...prev.filter((r) => r.id !== relId), rel1, rel2]);
    setSelectedRelationshipId(rel1.id);
    awardXp(50, '3NF Normalization: Decomposed M:N Relation');
  };

  // --------------------------------------------------------------------------
  // Universal Code & Spec Generators (SQL, PlantUML, Mermaid, JSON)
  // --------------------------------------------------------------------------

  const generatedSqlDdl = useMemo(() => {
    let sql = `-- ==========================================================================\n`;
    sql += `-- DataQuestAI - Relational Database Schema Specification (CSC1033)\n`;
    sql += `-- Generated on: ${new Date().toISOString()}\n`;
    sql += `-- Entities: ${entities.length} | Relationships: ${relationships.length}\n`;
    sql += `-- ==========================================================================\n\n`;

    entities.forEach((ent) => {
      sql += `-- Table: ${ent.name} (${ent.isWeak ? 'Weak Entity / Bridge' : 'Strong Entity'})\n`;
      if (ent.comment) sql += `-- Description: ${ent.comment}\n`;
      sql += `CREATE TABLE ${ent.name} (\n`;

      const lines: string[] = [];
      const primaryKeys: string[] = [];

      ent.attributes.forEach((attr) => {
        let colLine = `  ${attr.name} ${attr.dataType}`;
        if (!attr.isNullable) colLine += ` NOT NULL`;
        if (attr.isUnique && !attr.isPrimaryKey) colLine += ` UNIQUE`;
        if (attr.isPrimaryKey) primaryKeys.push(attr.name);
        lines.push(colLine);
      });

      if (primaryKeys.length > 0) {
        lines.push(`  PRIMARY KEY (${primaryKeys.join(', ')})`);
      }

      const foreignKeyRels = relationships.filter((r) => r.toEntityId === ent.id);
      foreignKeyRels.forEach((fkRel) => {
        const fromEnt = entities.find((e) => e.id === fkRel.fromEntityId);
        const fromAttr = fromEnt?.attributes.find((a) => a.id === fkRel.fromAttributeId);
        const toAttr = ent.attributes.find((a) => a.id === fkRel.toAttributeId);

        if (fromEnt && fromAttr && toAttr) {
          let fkLine = `  CONSTRAINT fk_${ent.name}_${toAttr.name} FOREIGN KEY (${toAttr.name}) REFERENCES ${fromEnt.name}(${fromAttr.name})`;
          if (fkRel.onDelete) fkLine += ` ON DELETE ${fkRel.onDelete}`;
          lines.push(fkLine);
        }
      });

      sql += lines.join(',\n');
      sql += `\n);\n\n`;
    });

    return sql;
  }, [entities, relationships]);

  const generatedPlantUml = useMemo(
    () => generatePlantUml(entities, relationships, diagramMode),
    [entities, relationships, diagramMode]
  );

  const generatedMermaid = useMemo(
    () => generateMermaid(entities, relationships, diagramMode),
    [entities, relationships, diagramMode]
  );

  const generatedJson = useMemo(
    () => JSON.stringify({ diagramMode, entities, relationships }, null, 2),
    [diagramMode, entities, relationships]
  );

  const handlePushToSqlLab = () => {
    try {
      sound.playLevelUp();
      const statements = generatedSqlDdl
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith('--'));

      statements.forEach((stmt) => {
        try {
          sqlLabEngine.execute(stmt);
        } catch {}
      });

      setSqlSyncSuccess('Schema compiled successfully into isolated In-Memory SQL Lab!');
      awardXp(50, 'Deployed Schema to SQL Lab');
      setTimeout(() => setSqlSyncSuccess(null), 4000);
    } catch (err: any) {
      sound.playError();
      alert(`Schema synchronization error: ${err.message}`);
    }
  };

  const handleCopyExportCode = (content: string) => {
    navigator.clipboard.writeText(content);
    sound.playSuccess();
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadExport = (content: string, filename: string) => {
    sound.playClick();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --------------------------------------------------------------------------
  // SVG Marker Defs & Path Rendering
  // --------------------------------------------------------------------------

  const renderRelationshipsSvg = () => {
    return (
      <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible">
        <defs>
          <filter id="connector-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Marker: Crow's Foot Fork (Many) */}
          <marker id="crows-foot-many" viewBox="0 0 16 16" refX="14" refY="8" markerWidth="14" markerHeight="14" orient="auto-start-reverse">
            <path d="M 0 0 L 14 8 L 0 16 M 14 0 L 14 16" fill="none" stroke="#8b5cf6" strokeWidth="2" />
          </marker>

          {/* Marker: Mandatory One Bar */}
          <marker id="crows-foot-one" viewBox="0 0 16 16" refX="4" refY="8" markerWidth="12" markerHeight="12" orient="auto-start-reverse">
            <path d="M 4 2 L 4 14 M 8 2 L 8 14" fill="none" stroke="#8b5cf6" strokeWidth="2" />
          </marker>

          {/* Marker: Standard UML Arrow */}
          <marker id="uml-arrow" viewBox="0 0 16 16" refX="14" refY="8" markerWidth="12" markerHeight="12" orient="auto">
            <path d="M 2 2 L 14 8 L 2 14 Z" fill="#3b82f6" />
          </marker>

          {/* Marker: Composition Filled Diamond */}
          <marker id="diamond-filled" viewBox="0 0 16 16" refX="8" refY="8" markerWidth="14" markerHeight="14" orient="auto">
            <path d="M 0 8 L 8 2 L 16 8 L 8 14 Z" fill="#8b5cf6" stroke="#c084fc" strokeWidth="1" />
          </marker>

          {/* Marker: Aggregation Open Diamond */}
          <marker id="diamond-open" viewBox="0 0 16 16" refX="8" refY="8" markerWidth="14" markerHeight="14" orient="auto">
            <path d="M 0 8 L 8 2 L 16 8 L 8 14 Z" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2" />
          </marker>

          {/* Marker: Async Open Arrow */}
          <marker id="async-arrow" viewBox="0 0 16 16" refX="14" refY="8" markerWidth="12" markerHeight="12" orient="auto">
            <path d="M 4 2 L 14 8 L 4 14" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
          </marker>
        </defs>

        {relationships.map((rel) => {
          const fromEnt = entities.find((e) => e.id === rel.fromEntityId);
          const toEnt = entities.find((e) => e.id === rel.toEntityId);
          if (!fromEnt || !toEnt) return null;

          const fromAttrIndex = fromEnt.attributes.findIndex((a) => a.id === rel.fromAttributeId);
          const toAttrIndex = toEnt.attributes.findIndex((a) => a.id === rel.toAttributeId);

          const fromIdx = fromAttrIndex >= 0 ? fromAttrIndex : 0;
          const toIdx = toAttrIndex >= 0 ? toAttrIndex : 0;

          const isTargetRight = toEnt.x > fromEnt.x;

          // Compute start and end port coordinates
          const startX = isTargetRight ? fromEnt.x + 240 : fromEnt.x;
          const startY = fromEnt.y + 55 + fromIdx * 28;

          const endX = isTargetRight ? toEnt.x : toEnt.x + 240;
          const endY = toEnt.y + 55 + toIdx * 28;

          const isRelinkingThis = relinking?.relationshipId === rel.id;
          const activeStart = isRelinkingThis && relinking.end === 'from' && dragMousePos ? dragMousePos : { x: startX, y: startY };
          const activeEnd = isRelinkingThis && relinking.end === 'to' && dragMousePos ? dragMousePos : { x: endX, y: endY };

          const routing = rel.routingStyle || defaultRoutingStyle;
          const { d: pathD, midPoint } = computeConnectionPath(
            activeStart,
            activeEnd,
            rel.waypoints || [],
            routing
          );

          const isSelected = selectedRelationshipId === rel.id;

          // Determine line style
          const strokeDash =
            rel.lineStyle === 'dashed'
              ? '6 4'
              : rel.lineStyle === 'dotted'
              ? '2 4'
              : !rel.isIdentifying && diagramMode === 'relational'
              ? '6 3'
              : 'none';

          // Determine markers
          const markerEndId =
            rel.arrowhead === 'diamond_filled'
              ? 'url(#diamond-filled)'
              : rel.arrowhead === 'diamond_open'
              ? 'url(#diamond-open)'
              : rel.arrowhead === 'uml_arrow'
              ? 'url(#uml-arrow)'
              : rel.arrowhead === 'async_arrow'
              ? 'url(#async-arrow)'
              : 'url(#crows-foot-many)';

          const markerStartId =
            diagramMode === 'relational' ? 'url(#crows-foot-one)' : undefined;

          return (
            <g
              key={rel.id}
              className="pointer-events-auto cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                setSelectedRelationshipId(rel.id);
                setSelectedEntityId(null);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                const rect = canvasRef.current?.getBoundingClientRect();
                if (!rect) return;
                const clickX = Math.round(((e.clientX - rect.left - pan.x) / zoom) / 10) * 10;
                const clickY = Math.round(((e.clientY - rect.top - pan.y) / zoom) / 10) * 10;
                handleAddWaypoint(rel.id, { x: clickX, y: clickY });
              }}
            >
              {/* Invisible Thick Hover Path for Easy Selection */}
              <path d={pathD} fill="none" stroke="transparent" strokeWidth="24" />

              {/* Glowing Outline when Selected */}
              {isSelected && (
                <path
                  d={pathD}
                  fill="none"
                  stroke={rel.color || '#a855f7'}
                  strokeWidth="8"
                  strokeOpacity="0.4"
                  filter="url(#connector-glow)"
                />
              )}

              {/* Core Rendered Path */}
              <path
                d={pathD}
                fill="none"
                stroke={isSelected ? '#c084fc' : rel.color || '#8b5cf6'}
                strokeWidth={isSelected ? '3' : '2'}
                strokeDasharray={strokeDash}
                markerStart={markerStartId}
                markerEnd={markerEndId}
                className="transition-all duration-150"
              />

              {/* Central Badge / Protocol Label with Inline Direct-Typing */}
              {inlineEditing?.type === 'relLabel' && inlineEditing.relId === rel.id ? (
                <foreignObject x={midPoint.x - 45} y={midPoint.y - 14} width="90" height="28">
                  <input
                    type="text"
                    autoFocus
                    defaultValue={rel.protocol || rel.label || rel.cardinality}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === 'Enter') {
                        handleUpdateRelationshipProtocol(rel.id, (e.target as HTMLInputElement).value);
                        setInlineEditing(null);
                      } else if (e.key === 'Escape') {
                        setInlineEditing(null);
                      }
                    }}
                    onBlur={(e) => {
                      handleUpdateRelationshipProtocol(rel.id, e.target.value);
                      setInlineEditing(null);
                    }}
                    className="w-full h-full px-2 rounded-xl bg-slate-900 text-white font-mono text-[10px] font-bold border border-purple-400 outline-none text-center shadow-lg"
                  />
                </foreignObject>
              ) : (
                <g
                  transform={`translate(${midPoint.x}, ${midPoint.y})`}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    setInlineEditing({ type: 'relLabel', relId: rel.id });
                  }}
                >
                  <rect
                    x="-32"
                    y="-12"
                    width="64"
                    height="24"
                    rx="12"
                    fill="#0f172a"
                    stroke={isSelected ? '#c084fc' : '#8b5cf6'}
                    strokeWidth="1.5"
                    className="shadow-md hover:stroke-purple-400 cursor-text"
                  >
                    <title>Double-click to type custom protocol or label</title>
                  </rect>
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {rel.protocol || rel.label || rel.cardinality}
                  </text>
                </g>
              )}

              {/* Interactive Waypoint Drag Handles (Elbow / Bend manipulation) */}
              {isSelected &&
                (rel.waypoints || []).map((wp, wpIdx) => (
                  <g key={wp.id} transform={`translate(${wp.x}, ${wp.y})`}>
                    <circle
                      r="7"
                      fill="#ec4899"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="cursor-move hover:scale-125 transition-transform"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        sound.playSnap();
                        setDraggingWaypoint({ relationshipId: rel.id, waypointId: wp.id });
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWaypoint(rel.id, wp.id);
                      }}
                    />
                    <text
                      x="0"
                      y="-10"
                      textAnchor="middle"
                      fill="#f472b6"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      ∠{wpIdx + 1}
                    </text>
                  </g>
                ))}

              {/* Interactive Endpoint Re-linking Handles */}
              {isSelected && (
                <>
                  {/* Start Handle */}
                  <circle
                    cx={activeStart.x}
                    cy={activeStart.y}
                    r="6"
                    fill="#3b82f6"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-grab hover:scale-150 transition-transform animate-pulse"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      sound.playSnap();
                      setRelinking({ relationshipId: rel.id, end: 'from' });
                    }}
                  >
                    <title>Drag to reconnect start of relationship</title>
                  </circle>

                  {/* End Handle */}
                  <circle
                    cx={activeEnd.x}
                    cy={activeEnd.y}
                    r="6"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-grab hover:scale-150 transition-transform animate-pulse"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      sound.playSnap();
                      setRelinking({ relationshipId: rel.id, end: 'to' });
                    }}
                  >
                    <title>Drag to reconnect end of relationship</title>
                  </circle>
                </>
              )}
            </g>
          );
        })}

        {/* Live Connecting Wire while dragging port or re-linking */}
        {(connectingFrom || relinking) && dragMousePos && (
          <path
            d={`M ${connectingFrom?.x || dragMousePos.x} ${connectingFrom?.y || dragMousePos.y} Q ${
              ((connectingFrom?.x || dragMousePos.x) + dragMousePos.x) / 2
            } ${((connectingFrom?.y || dragMousePos.y) + dragMousePos.y) / 2 - 40} ${dragMousePos.x} ${
              dragMousePos.y
            }`}
            fill="none"
            stroke="#ec4899"
            strokeWidth="3"
            strokeDasharray="4 4"
            className="animate-pulse"
          />
        )}
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full max-w-[1900px] mx-auto select-none overflow-hidden bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl relative font-sans">
      {/* Top Studio Control Bar */}
      <header className="h-14 px-4 sm:px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3 z-20 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-500/25">
            <Workflow className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Architecture &amp; UML Studio
              </h1>
            </div>
            <p className="text-[10px] text-slate-400 hidden md:block">
              Visual database design, relational schema modeling, and system architectures
            </p>
          </div>
        </div>

        {/* Center: Diagram Mode Switcher (Relational ERD | UML Class | Distributed Architecture) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-800/90 rounded-xl border border-slate-700/60 text-xs">
            <button
              onClick={() => {
                sound.playClick();
                setDiagramMode('relational');
                setDefaultRoutingStyle('orthogonal');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all text-xs ${
                diagramMode === 'relational'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Relational ERD</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setDiagramMode('uml');
                setDefaultRoutingStyle('orthogonal');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all text-xs ${
                diagramMode === 'uml'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>UML Class</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setDiagramMode('distributed');
                setDefaultRoutingStyle('orthogonal');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all text-xs ${
                diagramMode === 'distributed'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Distributed Systems</span>
            </button>
          </div>

          {/* Preset Templates */}
          <div className="hidden xl:flex items-center gap-1 p-1 bg-slate-800/60 rounded-xl border border-slate-700/50 text-xs">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Templates:
            </span>
            <button
              onClick={() => {
                sound.playClick();
                setDiagramMode('relational');
                setEntities(csc1033UniversityTemplate.entities);
                setRelationships(csc1033UniversityTemplate.relationships);
                setSelectedEntityId(null);
                setSelectedRelationshipId(null);
                awardXp(15, 'Loaded Academic Registry ERD');
              }}
              className="px-2 py-1 rounded-lg font-semibold hover:bg-slate-700 text-slate-300 text-xs"
            >
              Academic
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setDiagramMode('relational');
                setEntities(ecommerceTemplate.entities);
                setRelationships(ecommerceTemplate.relationships);
                setSelectedEntityId(null);
                setSelectedRelationshipId(null);
                awardXp(15, 'Loaded E-Commerce ERD');
              }}
              className="px-2 py-1 rounded-lg font-semibold hover:bg-slate-700 text-slate-300 text-xs"
            >
              E-Commerce
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setDiagramMode('uml');
                setEntities(umlDomainTemplate.entities);
                setRelationships(umlDomainTemplate.relationships);
                setSelectedEntityId(null);
                setSelectedRelationshipId(null);
                awardXp(15, 'Loaded UML Domain Template');
              }}
              className="px-2 py-1 rounded-lg font-semibold hover:bg-slate-700 text-slate-300 text-xs"
            >
              UML Domain
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setDiagramMode('distributed');
                setEntities(distributedCloudTemplate.entities);
                setRelationships(distributedCloudTemplate.relationships);
                setSelectedEntityId(null);
                setSelectedRelationshipId(null);
                awardXp(15, 'Loaded Distributed Systems Template');
              }}
              className="px-2 py-1 rounded-lg font-semibold hover:bg-slate-700 text-slate-300 text-xs"
            >
              Cloud Microservices
            </button>
          </div>
        </div>

        {/* Right Actions: Add Node & Export */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAddEntity}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>
              {diagramMode === 'distributed'
                ? 'Add Component'
                : diagramMode === 'uml'
                ? 'Add Class'
                : 'Add Entity'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-purple-400" />
            <span>Export &amp; Code</span>
          </button>

          <button
            type="button"
            onClick={handlePushToSqlLab}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Push to SQL Lab</span>
          </button>
        </div>
      </header>

      {/* Synchronized Feedback Banner */}
      {sqlSyncSuccess && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{sqlSyncSuccess}</span>
        </div>
      )}

      {/* Main Studio Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Canvas Area */}
        <div
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          className="flex-1 h-full relative overflow-hidden bg-slate-950 cursor-grab active:cursor-grabbing"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.08) 1.2px, transparent 0)`,
            backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }}
        >
          {/* Floating Canvas Quick-Tools (Zoom, Routing Style, Reset) */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-lg">
            {/* Routing Style Quick Switcher */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-800/80 mr-1 text-[11px]">
              <button
                onClick={() => {
                  sound.playClick();
                  setDefaultRoutingStyle('orthogonal');
                  if (selectedRelationship) {
                    setRelationships((prev) =>
                      prev.map((r) =>
                        r.id === selectedRelationship.id ? { ...r, routingStyle: 'orthogonal' } : r
                      )
                    );
                  }
                }}
                className={`p-1.5 rounded-md font-bold transition-all ${
                  defaultRoutingStyle === 'orthogonal'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Orthogonal / Elbow Routing (90° Right Angles)"
              >
                <CornerDownRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setDefaultRoutingStyle('curved');
                  if (selectedRelationship) {
                    setRelationships((prev) =>
                      prev.map((r) =>
                        r.id === selectedRelationship.id ? { ...r, routingStyle: 'curved' } : r
                      )
                    );
                  }
                }}
                className={`p-1.5 rounded-md font-bold transition-all ${
                  defaultRoutingStyle === 'curved'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Curved Bezier Routing"
              >
                <Activity className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setDefaultRoutingStyle('straight');
                  if (selectedRelationship) {
                    setRelationships((prev) =>
                      prev.map((r) =>
                        r.id === selectedRelationship.id ? { ...r, routingStyle: 'straight' } : r
                      )
                    );
                  }
                }}
                className={`p-1.5 rounded-md font-bold transition-all ${
                  defaultRoutingStyle === 'straight'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Straight Polyline Routing"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-400 px-1">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Floating Context Toolbar for Selected Element */}
          {(selectedEntity || selectedRelationship) && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900/95 border border-purple-500/40 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-top-2">
              {selectedEntity && (
                <>
                  <span className="text-xs font-mono font-bold text-purple-300 pr-2 border-r border-slate-800">
                    {selectedEntity.name}
                  </span>
                  <button
                    onClick={() => handleDuplicateEntity(selectedEntity.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                    title="Duplicate Entity (Cmd+D)"
                  >
                    <Copy className="w-3 h-3 text-purple-400" />
                    <span>Duplicate</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingEntity(selectedEntity);
                      setIsEntityModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                  >
                    <Edit2 className="w-3 h-3 text-blue-400" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteEntity(selectedEntity.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold"
                    title="Delete Entity (Delete key)"
                  >
                    <Trash2 className="w-3 h-3 text-rose-400" />
                    <span>Delete</span>
                  </button>
                </>
              )}

              {selectedRelationship && (
                <>
                  <span className="text-xs font-mono font-bold text-purple-300 pr-2 border-r border-slate-800">
                    {selectedRelationship.name}
                  </span>
                  <button
                    onClick={() => handleAddWaypoint(selectedRelationship.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                    title="Split Arrow / Add Angle Waypoint"
                  >
                    <Scissors className="w-3 h-3 text-pink-400" />
                    <span>Add Angle</span>
                  </button>
                  <button
                    onClick={() => handleReverseRelationship(selectedRelationship.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                    title="Reverse Arrow Direction"
                  >
                    <RotateCcw className="w-3 h-3 text-cyan-400" />
                    <span>Reverse</span>
                  </button>
                  <button
                    onClick={() => handleDuplicateRelationship(selectedRelationship.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                    title="Duplicate Arrow (Cmd+D)"
                  >
                    <Copy className="w-3 h-3 text-purple-400" />
                    <span>Duplicate</span>
                  </button>
                  <button
                    onClick={() => handleDeleteRelationship(selectedRelationship.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold"
                    title="Delete Arrow (Delete key)"
                  >
                    <Trash2 className="w-3 h-3 text-rose-400" />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>
          )}

          {/* Transformed Canvas Container */}
          <div
            className="absolute inset-0 origin-top-left pointer-events-none"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            }}
          >
            {/* SVG Wire Layer */}
            {renderRelationshipsSvg()}

            {/* Entity & Component Cards Layer */}
            {entities.map((entity) => {
              const isSelected = selectedEntityId === entity.id;

              return (
                <div
                  key={entity.id}
                  style={{
                    transform: `translate(${entity.x}px, ${entity.y}px)`,
                    width: 240,
                  }}
                  onMouseDown={(e) => startDraggingEntity(e, entity)}
                  onMouseUp={(e) => {
                    if (connectingFrom || relinking) {
                      const firstAttrId = entity.attributes[0]?.id || 'att_default';
                      handleDropOnPort(e, entity.id, firstAttrId);
                    }
                  }}
                  className={`absolute top-0 left-0 pointer-events-auto rounded-2xl bg-slate-900/95 border transition-shadow backdrop-blur-xl ${
                    isSelected
                      ? 'border-purple-400 shadow-xl shadow-purple-500/20 ring-2 ring-purple-500/30'
                      : 'border-slate-800 hover:border-slate-700 shadow-lg'
                  }`}
                >
                  {/* Entity / Component Header */}
                  <div
                    className="px-3 py-2.5 border-b border-slate-800 rounded-t-2xl flex items-center justify-between gap-1"
                    style={{
                      borderTop: `3px solid ${entity.color || '#8b5cf6'}`,
                    }}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {entity.nodeType === 'gateway' ? (
                        <Zap className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      ) : entity.nodeType === 'queue' ? (
                        <Activity className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      ) : entity.nodeType === 'database' ? (
                        <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : entity.nodeType === 'cache' ? (
                        <Cpu className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      ) : entity.nodeType === 'uml_class' ? (
                        <Boxes className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      ) : (
                        <Database className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      )}

                      <div className="min-w-0">
                        {entity.stereotype && (
                          <span className="text-[9px] font-mono text-slate-400 block leading-tight">
                            {entity.stereotype}
                          </span>
                        )}
                        {inlineEditing?.type === 'entityName' && inlineEditing.entityId === entity.id ? (
                          <input
                            type="text"
                            autoFocus
                            defaultValue={entity.name}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              e.stopPropagation();
                              if (e.key === 'Enter') {
                                handleRenameEntity(entity.id, (e.target as HTMLInputElement).value);
                                setInlineEditing(null);
                              } else if (e.key === 'Escape') {
                                setInlineEditing(null);
                              }
                            }}
                            onBlur={(e) => {
                              handleRenameEntity(entity.id, e.target.value);
                              setInlineEditing(null);
                            }}
                            className="px-1 py-0.5 rounded bg-slate-800 text-white font-mono text-xs font-bold border border-purple-500 outline-hidden w-32 shadow-inner"
                          />
                        ) : (
                          <span
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              sound.playClick();
                              setInlineEditing({ type: 'entityName', entityId: entity.id });
                            }}
                            title="Double-click to type new name"
                            className="font-mono text-xs font-bold text-white truncate block cursor-text hover:text-purple-300 transition-colors"
                          >
                            {entity.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateEntity(entity.id);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-purple-300 hover:bg-slate-800"
                        title="Duplicate"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingEntity(entity);
                          setIsEntityModalOpen(true);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Edit in Modal"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEntity(entity.id);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Distributed Systems Telemetry Badge (If Available) */}
                  {entity.metrics && (
                    <div className="px-3 py-1 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                      <div className="flex items-center gap-1 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{entity.metrics.rps || 'Healthy'}</span>
                      </div>
                      <span className="text-slate-400">{entity.metrics.latency}</span>
                    </div>
                  )}

                  {/* Attributes Column List */}
                  <div className="divide-y divide-slate-800/60 p-1">
                    {entity.attributes.map((attr) => (
                      <div
                        key={attr.id}
                        className="flex items-center justify-between px-2 py-1.5 text-[11px] hover:bg-slate-800/40 rounded-lg group/attr transition-colors relative"
                      >
                        {/* Left: Key icons & Name */}
                        <div className="flex items-center gap-1.5 min-w-0">
                          {attr.isPrimaryKey ? (
                            <span title="Primary Key (PK)">
                              <Key className="w-3 h-3 text-amber-400 shrink-0" />
                            </span>
                          ) : attr.isForeignKey ? (
                            <span title="Foreign Key (FK)">
                              <LinkIcon className="w-3 h-3 text-purple-400 shrink-0" />
                            </span>
                          ) : (
                            <span className="w-3 h-3 block" />
                          )}

                          {inlineEditing?.type === 'attrName' &&
                          inlineEditing.entityId === entity.id &&
                          inlineEditing.attrId === attr.id ? (
                            <input
                              type="text"
                              autoFocus
                              defaultValue={attr.name}
                              onClick={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                              onKeyDown={(e) => {
                                e.stopPropagation();
                                if (e.key === 'Enter') {
                                  handleRenameAttribute(entity.id, attr.id, (e.target as HTMLInputElement).value);
                                  setInlineEditing(null);
                                } else if (e.key === 'Escape') {
                                  setInlineEditing(null);
                                }
                              }}
                              onBlur={(e) => {
                                handleRenameAttribute(entity.id, attr.id, e.target.value);
                                setInlineEditing(null);
                              }}
                              className="px-1 py-0.2 rounded bg-slate-800 text-purple-200 font-mono text-[11px] border border-purple-500 outline-hidden w-24"
                            />
                          ) : (
                            <span
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                sound.playClick();
                                setInlineEditing({ type: 'attrName', entityId: entity.id, attrId: attr.id });
                              }}
                              title="Double-click to type new name"
                              className={`font-mono truncate cursor-text hover:text-purple-300 transition-colors ${
                                attr.isPrimaryKey
                                  ? 'font-bold text-amber-300 underline decoration-amber-500/50'
                                  : attr.isForeignKey
                                  ? 'text-purple-300'
                                  : 'text-slate-300'
                              }`}
                            >
                              {attr.name}
                            </span>
                          )}
                        </div>

                        {/* Right: Data Type & Connector Port */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {inlineEditing?.type === 'attrType' &&
                          inlineEditing.entityId === entity.id &&
                          inlineEditing.attrId === attr.id ? (
                            <input
                              type="text"
                              autoFocus
                              defaultValue={attr.dataType}
                              onClick={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                              onKeyDown={(e) => {
                                e.stopPropagation();
                                if (e.key === 'Enter') {
                                  handleChangeAttributeType(entity.id, attr.id, (e.target as HTMLInputElement).value);
                                  setInlineEditing(null);
                                } else if (e.key === 'Escape') {
                                  setInlineEditing(null);
                                }
                              }}
                              onBlur={(e) => {
                                handleChangeAttributeType(entity.id, attr.id, e.target.value);
                                setInlineEditing(null);
                              }}
                              className="px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-mono text-[9px] border border-purple-500 outline-hidden w-16"
                            />
                          ) : (
                            <span
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                sound.playClick();
                                setInlineEditing({ type: 'attrType', entityId: entity.id, attrId: attr.id });
                              }}
                              title="Double-click to edit type"
                              className="font-mono text-[9px] text-slate-500 hover:text-slate-300 cursor-text transition-colors"
                            >
                              {attr.dataType.split('(')[0]}
                            </span>
                          )}

                          {/* Connector Port Circle (Click & Drag to connect) */}
                          <button
                            type="button"
                            onMouseDown={(e) => handleStartConnect(e, entity.id, attr.id)}
                            onMouseUp={(e) => handleDropOnPort(e, entity.id, attr.id)}
                            title="Drag connection wire to another table column to create a relationship"
                            className="w-3 h-3 rounded-full border border-purple-400 bg-purple-950 hover:bg-purple-500 hover:scale-125 transition-all cursor-crosshair shrink-0"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* UML Methods Section (If Present) */}
                  {entity.methods && entity.methods.length > 0 && (
                    <div className="border-t border-slate-800/80 p-1 divide-y divide-slate-800/50">
                      {entity.methods.map((method) => (
                        <div
                          key={method.id}
                          className="px-2 py-1 text-[10px] font-mono text-blue-300 truncate"
                        >
                          {inlineEditing?.type === 'methodName' &&
                          inlineEditing.entityId === entity.id &&
                          inlineEditing.methodId === method.id ? (
                            <input
                              type="text"
                              autoFocus
                              defaultValue={method.name}
                              onClick={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                              onKeyDown={(e) => {
                                e.stopPropagation();
                                if (e.key === 'Enter') {
                                  handleRenameMethod(entity.id, method.id, (e.target as HTMLInputElement).value);
                                  setInlineEditing(null);
                                } else if (e.key === 'Escape') {
                                  setInlineEditing(null);
                                }
                              }}
                              onBlur={(e) => {
                                handleRenameMethod(entity.id, method.id, e.target.value);
                                setInlineEditing(null);
                              }}
                              className="px-1 py-0.2 rounded bg-slate-800 text-blue-200 font-mono text-[10px] border border-purple-500 outline-hidden w-full"
                            />
                          ) : (
                            <span
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                sound.playClick();
                                setInlineEditing({ type: 'methodName', entityId: entity.id, methodId: method.id });
                              }}
                              title="Double-click to type new method name"
                              className="cursor-text hover:text-blue-200 transition-colors block truncate"
                            >
                              <span className="text-slate-400">{method.visibility} </span>
                              <span>{method.name}({method.parameters || ''}): </span>
                              <span className="text-slate-400">{method.returnType}</span>
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Column Button at bottom of card */}
                  <div className="p-1.5 pt-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAddAttribute(entity.id);
                      }}
                      className="w-full py-1 rounded-lg border border-dashed border-slate-700 hover:border-purple-500 hover:bg-purple-500/10 text-slate-400 hover:text-purple-300 text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>Add Attribute / Port</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Active Entity & Relationship Property Inspector */}
        <aside className="w-80 border-l border-slate-800 bg-slate-900/95 backdrop-blur-xl p-4 flex flex-col gap-4 overflow-y-auto z-20">
          {/* Inspector Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-purple-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Property Inspector
              </h2>
            </div>
            {selectedEntity || selectedRelationship ? (
              <button
                onClick={() => {
                  setSelectedEntityId(null);
                  setSelectedRelationshipId(null);
                }}
                className="text-[10px] text-slate-400 hover:text-slate-200"
              >
                Deselect
              </button>
            ) : null}
          </div>

          {/* 1. If Relationship is Selected */}
          {selectedRelationship ? (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-2">
                <span className="text-[10px] font-bold font-mono text-purple-300 uppercase tracking-wider block">
                  Connection Identifier
                </span>
                <input
                  type="text"
                  value={selectedRelationship.name}
                  onChange={(e) => handleRenameRelationship(selectedRelationship.id, e.target.value)}
                  placeholder="e.g. orders_to_customers"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-purple-500/40 bg-slate-900 text-xs font-mono font-bold text-white outline-hidden focus:border-purple-400"
                />
                <div className="text-[11px] text-slate-300 font-mono">
                  {entities.find((e) => e.id === selectedRelationship.fromEntityId)?.name} ➔{' '}
                  {entities.find((e) => e.id === selectedRelationship.toEntityId)?.name}
                </div>
              </div>

              {/* Routing Style & Angle Controls */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
                  Routing Style &amp; Angles
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['orthogonal', 'curved', 'straight'] as RoutingStyle[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        sound.playClick();
                        setRelationships((prev) =>
                          prev.map((r) =>
                            r.id === selectedRelationship.id ? { ...r, routingStyle: st } : r
                          )
                        );
                      }}
                      className={`py-1.5 px-2 rounded-xl text-[10px] font-mono font-bold border capitalize transition-all ${
                        (selectedRelationship.routingStyle || defaultRoutingStyle) === st
                          ? 'border-purple-400 bg-purple-600/30 text-white'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleAddWaypoint(selectedRelationship.id)}
                    className="flex-1 py-1.5 rounded-xl border border-dashed border-slate-700 hover:border-purple-400 bg-slate-800/50 hover:bg-purple-500/10 text-xs font-bold text-purple-300 flex items-center justify-center gap-1.5"
                  >
                    <Scissors className="w-3 h-3 text-pink-400" />
                    <span>Split / Add Waypoint</span>
                  </button>

                  <button
                    onClick={() => handleReverseRelationship(selectedRelationship.id)}
                    className="p-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                    title="Reverse Arrow Direction"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Cardinality Selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
                  Cardinality Type
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['1:1', '1:N', 'N:1', 'M:N'] as ErdCardinality[]).map((card) => (
                    <button
                      key={card}
                      onClick={() => {
                        sound.playClick();
                        setRelationships((prev) =>
                          prev.map((r) => (r.id === selectedRelationship.id ? { ...r, cardinality: card } : r))
                        );
                      }}
                      className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                        selectedRelationship.cardinality === card
                          ? 'border-purple-400 bg-purple-600/30 text-white shadow-xs'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {card}
                    </button>
                  ))}
                </div>
              </div>

              {/* Arrowhead & UML Styles */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
                  Arrowhead Semantics
                </label>
                <select
                  value={selectedRelationship.arrowhead || 'crows_foot'}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setRelationships((prev) =>
                      prev.map((r) =>
                        r.id === selectedRelationship.id ? { ...r, arrowhead: val } : r
                      )
                    );
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs text-white"
                >
                  <option value="crows_foot">Crow&apos;s Foot (Relational)</option>
                  <option value="uml_arrow">UML Association (Arrow)</option>
                  <option value="diamond_filled">UML Composition (Filled Diamond ◆)</option>
                  <option value="diamond_open">UML Aggregation (Open Diamond ◇)</option>
                  <option value="async_arrow">Async Protocol / Event (Open ➔)</option>
                </select>
              </div>

              {/* Protocol / Label Annotation (For Distributed Systems) */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Protocol / Transport Label
                </label>
                <input
                  type="text"
                  value={selectedRelationship.protocol || selectedRelationship.label || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRelationships((prev) =>
                      prev.map((r) =>
                        r.id === selectedRelationship.id
                          ? { ...r, protocol: val, label: val }
                          : r
                      )
                    );
                  }}
                  placeholder="e.g. gRPC, REST, Kafka Event"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs text-white font-mono"
                />
              </div>

              {/* M:N Decompose Special Feature */}
              {selectedRelationship.cardinality === 'M:N' && (
                <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-pink-300 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>3NF Normalization</span>
                  </div>
                  <p className="text-[10px] text-slate-300">
                    Many-to-Many relations violate 3NF. Decompose this into an Associative Bridge Table.
                  </p>
                  <button
                    onClick={() => handleDecomposeManyToMany(selectedRelationship.id)}
                    className="w-full py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-[11px] font-bold shadow-md shadow-pink-600/30 transition-all flex items-center justify-center gap-1"
                  >
                    <span>Decompose into Bridge Entity</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* ON DELETE Action */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  ON DELETE Referential Action
                </label>
                <select
                  value={selectedRelationship.onDelete || 'CASCADE'}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setRelationships((prev) =>
                      prev.map((r) => (r.id === selectedRelationship.id ? { ...r, onDelete: val } : r))
                    );
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs text-white"
                >
                  <option value="CASCADE">CASCADE (Delete children)</option>
                  <option value="RESTRICT">RESTRICT (Block deletion)</option>
                  <option value="SET NULL">SET NULL (Set foreign key to NULL)</option>
                  <option value="NO ACTION">NO ACTION</option>
                </select>
              </div>

              {/* Actions: Duplicate & Delete */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleDuplicateRelationship(selectedRelationship.id)}
                  className="w-full py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5 text-purple-400" />
                  <span>Duplicate Connection</span>
                </button>

                <button
                  onClick={() => handleDeleteRelationship(selectedRelationship.id)}
                  className="w-full py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Disconnect Relationship</span>
                </button>
              </div>
            </div>
          ) : selectedEntity ? (
            /* 2. If Entity is Selected */
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {selectedEntity.nodeType === 'uml_class'
                    ? 'UML Class Name'
                    : selectedEntity.nodeType === 'microservice' ||
                      selectedEntity.nodeType === 'gateway' ||
                      selectedEntity.nodeType === 'queue'
                    ? 'Distributed Component Name'
                    : 'Table Name'}
                </span>
                <input
                  type="text"
                  value={selectedEntity.name}
                  onChange={(e) => handleRenameEntity(selectedEntity.id, e.target.value)}
                  placeholder="e.g. students, OrderService"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-purple-500/40 bg-slate-900 text-sm font-mono font-bold text-white outline-hidden focus:border-purple-400"
                />

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-0.5">
                    Stereotype / Tech Badge
                  </label>
                  <input
                    type="text"
                    value={selectedEntity.stereotype || selectedEntity.techBadge || ''}
                    onChange={(e) => handleUpdateEntityStereotype(selectedEntity.id, e.target.value)}
                    placeholder="e.g. <<service>>, Kafka, Redis, Go"
                    className="w-full px-2 py-1 rounded-lg border border-slate-700 bg-slate-900 text-xs font-mono text-purple-300 outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-0.5">
                    Documentation / Note
                  </label>
                  <textarea
                    value={selectedEntity.comment || ''}
                    onChange={(e) => handleUpdateEntityComment(selectedEntity.id, e.target.value)}
                    rows={2}
                    placeholder="Description of the entity role..."
                    className="w-full px-2 py-1 rounded-lg border border-slate-700 bg-slate-900 text-xs text-slate-300 outline-hidden"
                  />
                </div>
              </div>

              {/* Attributes in Selected Entity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300">
                    Attributes / Ports ({selectedEntity.attributes.length})
                  </span>
                  <button
                    onClick={() => handleOpenAddAttribute(selectedEntity.id)}
                    className="text-[10px] font-bold text-purple-400 hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {selectedEntity.attributes.map((attr) => (
                    <div
                      key={attr.id}
                      className="p-2 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs gap-1.5"
                    >
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEntities((prev) =>
                              prev.map((ent) =>
                                ent.id === selectedEntity.id
                                  ? {
                                      ...ent,
                                      attributes: ent.attributes.map((a) =>
                                        a.id === attr.id
                                          ? { ...a, isPrimaryKey: !a.isPrimaryKey }
                                          : a
                                      ),
                                    }
                                  : ent
                              )
                            );
                          }}
                          title="Toggle Primary Key"
                          className="shrink-0"
                        >
                          {attr.isPrimaryKey ? (
                            <Key className="w-3.5 h-3.5 text-amber-400" />
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full bg-slate-700 block hover:bg-slate-600" />
                          )}
                        </button>

                        <input
                          type="text"
                          value={attr.name}
                          onChange={(e) =>
                            handleRenameAttribute(selectedEntity.id, attr.id, e.target.value)
                          }
                          className="w-full px-1.5 py-0.5 rounded bg-slate-900 text-white font-mono text-[11px] border border-slate-700 focus:border-purple-400 outline-hidden"
                          title="Click to rename attribute"
                        />
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <select
                          value={attr.dataType}
                          onChange={(e) =>
                            handleChangeAttributeType(selectedEntity.id, attr.id, e.target.value)
                          }
                          className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[9px] outline-hidden"
                        >
                          <option value="INT">INT</option>
                          <option value="BIGINT">BIGINT</option>
                          <option value="VARCHAR(100)">VARCHAR(100)</option>
                          <option value="VARCHAR(255)">VARCHAR(255)</option>
                          <option value="TEXT">TEXT</option>
                          <option value="BOOLEAN">BOOLEAN</option>
                          <option value="DECIMAL(10,2)">DECIMAL</option>
                          <option value="DATE">DATE</option>
                          <option value="TIMESTAMP">TIMESTAMP</option>
                          <option value="UUID">UUID</option>
                          <option value="HTTPS">HTTPS</option>
                          <option value="Protobuf">Protobuf</option>
                          <option value="In-Memory">In-Memory</option>
                        </select>
                        <button
                          onClick={() => handleDeleteAttribute(selectedEntity.id, attr.id)}
                          className="p-1 text-slate-400 hover:text-rose-400"
                          title="Delete attribute"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Entity Controls */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => handleDuplicateEntity(selectedEntity.id)}
                  className="w-full py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5 text-purple-400" />
                  <span>Duplicate Architecture Node</span>
                </button>

                <button
                  onClick={() => {
                    setEditingEntity(selectedEntity);
                    setIsEntityModalOpen(true);
                  }}
                  className="w-full py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Properties</span>
                </button>

                <button
                  onClick={() => handleDeleteEntity(selectedEntity.id)}
                  className="w-full py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Delete Node</span>
                </button>
              </div>
            </div>
          ) : (
            /* 3. Empty Inspector State */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-slate-500 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400">
                <HelpCircle className="w-6 h-6" />
              </div>
              <p className="text-xs font-medium text-slate-400">
                Click any Card or Arrow line to inspect, re-link, or split into angles.
              </p>
              <div className="text-[11px] text-purple-400 bg-purple-500/10 border border-purple-500/20 p-2.5 rounded-xl text-left space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Pro Shortcuts:</span>
                </p>
                <p className="text-slate-300">
                  • <b>Double Click</b> any arrow to split and add an elbow angle!
                </p>
                <p className="text-slate-300">
                  • <b>Drag endpoints</b> (blue/green circles) to reconnect arrows!
                </p>
                <p className="text-slate-300">
                  • <b>Cmd+D</b> duplicates nodes or connections instantly!
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: Create / Edit Entity or Distributed Component */}
      {/* ========================================================================= */}
      {isEntityModalOpen && editingEntity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Workflow className="w-4 h-4 text-purple-400" />
                <span>
                  {entities.some((e) => e.id === editingEntity.id)
                    ? 'Edit System Node'
                    : 'Create New Architecture Node'}
                </span>
              </h3>
              <button
                onClick={() => setIsEntityModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Identifier Name
                </label>
                <input
                  type="text"
                  value={editingEntity.name}
                  onChange={(e) => setEditingEntity({ ...editingEntity, name: e.target.value })}
                  placeholder="e.g. OrderService, customers"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Stereotype / Tech Badge
                </label>
                <input
                  type="text"
                  value={editingEntity.stereotype || editingEntity.techBadge || ''}
                  onChange={(e) =>
                    setEditingEntity({
                      ...editingEntity,
                      stereotype: e.target.value,
                      techBadge: e.target.value,
                    })
                  }
                  placeholder="e.g. <<service>>, Envoy, Kafka, Redis"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Architecture Description
                </label>
                <textarea
                  value={editingEntity.comment || ''}
                  onChange={(e) => setEditingEntity({ ...editingEntity, comment: e.target.value })}
                  placeholder="Description of the component role in the distributed system..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Header Accent Color
                </label>
                <div className="flex items-center gap-2">
                  {['#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#f97316'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setEditingEntity({ ...editingEntity, color: c })}
                      style={{ backgroundColor: c }}
                      className={`w-7 h-7 rounded-xl transition-transform ${
                        editingEntity.color === c ? 'scale-125 ring-2 ring-white' : 'opacity-80 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEntityModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEntity}
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30"
              >
                Save Node
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Create / Edit Attribute Column */}
      {/* ========================================================================= */}
      {isAttributeModalOpen && editingAttribute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-purple-400" />
                <span>Attribute / Port Specification</span>
              </h3>
              <button
                onClick={() => setIsAttributeModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Attribute / Port Name
                </label>
                <input
                  type="text"
                  value={editingAttribute.name}
                  onChange={(e) => setEditingAttribute({ ...editingAttribute, name: e.target.value })}
                  placeholder="e.g. user_id, port_8080"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Type Definition
                </label>
                <input
                  type="text"
                  value={editingAttribute.dataType}
                  onChange={(e) => setEditingAttribute({ ...editingAttribute, dataType: e.target.value })}
                  placeholder="e.g. INT, VARCHAR(255), UUID, HTTPS, gRPC"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Primary Identifier</span>
                      <span className="text-[10px] text-slate-400">Primary Key or Main Gateway Port</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={editingAttribute.isPrimaryKey}
                    onChange={(e) =>
                      setEditingAttribute({
                        ...editingAttribute,
                        isPrimaryKey: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">NOT NULL / Required</span>
                    <span className="text-[10px] text-slate-400">Mandatory attribute value</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={!editingAttribute.isNullable}
                    onChange={(e) => setEditingAttribute({ ...editingAttribute, isNullable: !e.target.checked })}
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAttributeModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAttribute}
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30"
              >
                Apply Attribute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EXPORT MODAL: SQL DDL, PlantUML, Mermaid.js & JSON */}
      {/* ========================================================================= */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Universal Architecture Export</h3>
                  <p className="text-xs text-slate-400">Export as SQL DDL, PlantUML, Mermaid diagram, or JSON schema</p>
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Export Format Selector Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setExportTab('sql')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  exportTab === 'sql'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                📜 SQL DDL
              </button>
              <button
                onClick={() => setExportTab('plantuml')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  exportTab === 'plantuml'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                🌿 PlantUML
              </button>
              <button
                onClick={() => setExportTab('mermaid')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  exportTab === 'mermaid'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                📊 Mermaid.js
              </button>
              <button
                onClick={() => setExportTab('json')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  exportTab === 'json'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                💾 JSON Spec
              </button>
            </div>

            {/* Code Block Viewer */}
            <div className="flex-1 overflow-y-auto rounded-2xl bg-black/70 p-4 border border-slate-800 font-mono text-xs text-purple-200 select-text leading-relaxed">
              <pre>
                {exportTab === 'sql'
                  ? generatedSqlDdl
                  : exportTab === 'plantuml'
                  ? generatedPlantUml
                  : exportTab === 'mermaid'
                  ? generatedMermaid
                  : generatedJson}
              </pre>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between shrink-0 pt-2">
              <span className="text-[11px] text-slate-500 font-mono">
                {entities.length} Nodes • {relationships.length} Architectural Connections
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const content =
                      exportTab === 'sql'
                        ? generatedSqlDdl
                        : exportTab === 'plantuml'
                        ? generatedPlantUml
                        : exportTab === 'mermaid'
                        ? generatedMermaid
                        : generatedJson;
                    const ext =
                      exportTab === 'sql'
                        ? 'schema.sql'
                        : exportTab === 'plantuml'
                        ? 'architecture.puml'
                        : exportTab === 'mermaid'
                        ? 'diagram.mmd'
                        : 'architecture.json';
                    handleDownloadExport(content, ext);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>

                <button
                  onClick={() => {
                    const content =
                      exportTab === 'sql'
                        ? generatedSqlDdl
                        : exportTab === 'plantuml'
                        ? generatedPlantUml
                        : exportTab === 'mermaid'
                        ? generatedMermaid
                        : generatedJson;
                    handleCopyExportCode(content);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
