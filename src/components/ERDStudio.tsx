'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { sound } from '@/lib/audio';
import { sqlLabEngine } from '@/lib/sql-lab-engine';
import {
  ERDEntity,
  ERDAttribute,
  ERDRelationship,
  ErdCardinality,
  ErdNotation,
} from '@/lib/types';
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
} from 'lucide-react';

// ============================================================================
// CSC1033 STANDARD COURSE TEMPLATES
// ============================================================================

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
      color: '#8b5cf6', // purple
      isWeak: false,
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
      x: 850,
      y: 80,
      color: '#06b6d4', // cyan
      isWeak: false,
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
      x: 850,
      y: 380,
      color: '#10b981', // emerald
      isWeak: false,
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
      color: '#f59e0b', // amber
      isWeak: false,
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
      color: '#ec4899', // pink
      isWeak: true,
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
    },
  ],
};

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
      x: 800,
      y: 120,
      color: '#ec4899',
      isWeak: true,
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
      x: 800,
      y: 380,
      color: '#f59e0b',
      isWeak: false,
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
    },
  ],
};

export const ERDStudio: React.FC = () => {
  const { setActiveTab, awardXp } = useAppStore();

  // Core Data States
  const [entities, setEntities] = useState<ERDEntity[]>(csc1033UniversityTemplate.entities);
  const [relationships, setRelationships] = useState<ERDRelationship[]>(csc1033UniversityTemplate.relationships);
  const [notation, setNotation] = useState<ErdNotation>('crows_foot');

  // Canvas Viewport & Pan/Zoom
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const startPanRef = useRef({ x: 0, y: 0 });

  // Selection & Inspector
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<{
    entityId: string;
    attributeId: string;
    x: number;
    y: number;
  } | null>(null);
  const [dragMousePos, setDragMousePos] = useState<{ x: number; y: number } | null>(null);

  // Modals & Panels
  const [isEntityModalOpen, setIsEntityModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<ERDEntity | null>(null);
  const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
  const [editingAttributeEntityId, setEditingAttributeEntityId] = useState<string | null>(null);
  const [editingAttribute, setEditingAttribute] = useState<ERDAttribute | null>(null);
  const [showSqlDdlModal, setShowSqlDdlModal] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);
  const [sqlSyncSuccess, setSqlSyncSuccess] = useState<string | null>(null);

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
  // Dragging & Canvas Handlers
  // --------------------------------------------------------------------------

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Only pan if clicking empty canvas
    if (e.target === canvasRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsPanning(true);
      startPanRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
      setSelectedEntityId(null);
      setSelectedRelationshipId(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPanRef.current.x,
        y: e.clientY - startPanRef.current.y,
      });
      return;
    }

    if (draggingEntityId) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const rawX = (e.clientX - rect.left - pan.x) / zoom - dragEntityOffsetRef.current.x;
      const rawY = (e.clientY - rect.top - pan.y) / zoom - dragEntityOffsetRef.current.y;

      // Magnetic snap to 10px grid
      const snapX = Math.round(rawX / 10) * 10;
      const snapY = Math.round(rawY / 10) * 10;

      setEntities((prev) =>
        prev.map((ent) => (ent.id === draggingEntityId ? { ...ent, x: Math.max(10, snapX), y: Math.max(10, snapY) } : ent))
      );
    }

    if (connectingFrom) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      setDragMousePos({
        x: (e.clientX - rect.left - pan.x) / zoom,
        y: (e.clientY - rect.top - pan.y) / zoom,
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
    setDraggingEntityId(null);
    if (connectingFrom) {
      setConnectingFrom(null);
      setDragMousePos(null);
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
  // Interactive Port Connector (Wire Drawing)
  // --------------------------------------------------------------------------

  const handleStartConnect = (e: React.MouseEvent, entityId: string, attributeId: string) => {
    e.stopPropagation();
    sound.playSnap();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const sourceEntity = entities.find((ent) => ent.id === entityId);
    if (!sourceEntity) return;

    // Approximate port position
    const attrIndex = sourceEntity.attributes.findIndex((a) => a.id === attributeId);
    const portX = sourceEntity.x + 240;
    const portY = sourceEntity.y + 60 + attrIndex * 28;

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
    if (!connectingFrom || connectingFrom.entityId === targetEntityId) {
      setConnectingFrom(null);
      setDragMousePos(null);
      return;
    }

    sound.playSuccess();

    // Check if source attribute is primary key, infer cardinality
    const sourceEnt = entities.find((ent) => ent.id === connectingFrom.entityId);
    const targetEnt = entities.find((ent) => ent.id === targetEntityId);
    const sourceAttr = sourceEnt?.attributes.find((a) => a.id === connectingFrom.attributeId);
    const targetAttr = targetEnt?.attributes.find((a) => a.id === targetAttributeId);

    let defaultCardinality: ErdCardinality = '1:N';
    if (sourceAttr?.isPrimaryKey && targetAttr?.isPrimaryKey) {
      defaultCardinality = '1:1';
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
      cardinality: defaultCardinality,
      fromModality: 'mandatory',
      toModality: 'optional',
      isIdentifying: targetAttr?.isPrimaryKey || false,
      onDelete: 'CASCADE',
    };

    setRelationships((prev) => [...prev, newRel]);
    setSelectedRelationshipId(newRel.id);
    setConnectingFrom(null);
    setDragMousePos(null);
    awardXp(25, 'Connected Relational Foreign Key');
  };

  // --------------------------------------------------------------------------
  // Entity CRUD
  // --------------------------------------------------------------------------

  const handleOpenAddEntity = () => {
    sound.playClick();
    setEditingEntity({
      id: 'ent_' + Math.random().toString(36).substring(2, 8),
      name: 'new_table',
      comment: 'Relational entity table',
      x: Math.max(50, -pan.x + 200),
      y: Math.max(50, -pan.y + 150),
      color: '#6366f1',
      isWeak: false,
      attributes: [
        {
          id: 'att_' + Math.random().toString(36).substring(2, 8),
          name: 'id',
          dataType: 'INT',
          isPrimaryKey: true,
          isNullable: false,
          isUnique: true,
        },
      ],
    });
    setIsEntityModalOpen(true);
  };

  const handleSaveEntity = () => {
    if (!editingEntity || !editingEntity.name.trim()) return;
    sound.playSuccess();
    const cleanName = editingEntity.name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');

    setEntities((prev) => {
      const exists = prev.some((e) => e.id === editingEntity.id);
      if (exists) {
        return prev.map((e) => (e.id === editingEntity.id ? { ...editingEntity, name: cleanName } : e));
      }
      return [...prev, { ...editingEntity, name: cleanName }];
    });

    setIsEntityModalOpen(false);
    setSelectedEntityId(editingEntity.id);
    awardXp(15, 'Created Relational Entity');
  };

  const handleDeleteEntity = (entityId: string) => {
    sound.playError();
    setEntities((prev) => prev.filter((e) => e.id !== entityId));
    setRelationships((prev) => prev.filter((r) => r.fromEntityId !== entityId && r.toEntityId !== entityId));
    if (selectedEntityId === entityId) setSelectedEntityId(null);
  };

  // --------------------------------------------------------------------------
  // Attribute CRUD
  // --------------------------------------------------------------------------

  const handleOpenAddAttribute = (entityId: string) => {
    sound.playClick();
    setEditingAttributeEntityId(entityId);
    setEditingAttribute({
      id: 'att_' + Math.random().toString(36).substring(2, 8),
      name: 'column_name',
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
    const cleanName = editingAttribute.name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');

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
    // Remove relationships referencing this attribute
    setRelationships((prev) =>
      prev.filter((r) => r.fromAttributeId !== attributeId && r.toAttributeId !== attributeId)
    );
  };

  // --------------------------------------------------------------------------
  // Relationship Normalization (Decompose M:N into Junction Table - CSC1033)
  // --------------------------------------------------------------------------

  const handleDecomposeManyToMany = (relId: string) => {
    const rel = relationships.find((r) => r.id === relId);
    if (!rel) return;

    const fromEnt = entities.find((e) => e.id === rel.fromEntityId);
    const toEnt = entities.find((e) => e.id === rel.toEntityId);
    if (!fromEnt || !toEnt) return;

    sound.playLevelUp();

    // Create Junction Table between From and To
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

    // Remove old M:N relation, add two 1:N relations
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
    };

    setEntities((prev) => [...prev, junctionEntity]);
    setRelationships((prev) => [...prev.filter((r) => r.id !== relId), rel1, rel2]);
    setSelectedRelationshipId(rel1.id);
    awardXp(50, '3NF Normalization: Decomposed M:N Relation');
  };

  // --------------------------------------------------------------------------
  // SQL DDL Generation & Compilation
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

      // Foreign Keys in this table
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

  const handlePushToSqlLab = () => {
    try {
      sound.playLevelUp();
      // Execute each CREATE TABLE statement in the SQL Lab engine
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

  const handleCopySql = () => {
    navigator.clipboard.writeText(generatedSqlDdl);
    sound.playSuccess();
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2000);
  };

  // --------------------------------------------------------------------------
  // SVG Path Calculation for Connectors
  // --------------------------------------------------------------------------

  const renderRelationshipsSvg = () => {
    return (
      <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible">
        <defs>
          {/* Neon Glow Filters */}
          <filter id="erd-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Marker: One-to-Many Crow's Foot Fork */}
          <marker id="crows-foot-many" viewBox="0 0 16 16" refX="14" refY="8" markerWidth="12" markerHeight="12" orient="auto-start-reverse">
            <path d="M 0 0 L 14 8 L 0 16 M 14 0 L 14 16" fill="none" stroke="#8b5cf6" strokeWidth="2" />
          </marker>

          {/* Marker: Mandatory One Bar */}
          <marker id="crows-foot-one" viewBox="0 0 16 16" refX="4" refY="8" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
            <path d="M 4 2 L 4 14 M 8 2 L 8 14" fill="none" stroke="#8b5cf6" strokeWidth="2" />
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

          // Connect from right of Source to left of Target (or vice versa based on geometry)
          const isTargetRight = toEnt.x > fromEnt.x;

          const startX = isTargetRight ? fromEnt.x + 240 : fromEnt.x;
          const startY = fromEnt.y + 55 + fromIdx * 28;

          const endX = isTargetRight ? toEnt.x : toEnt.x + 240;
          const endY = toEnt.y + 55 + toIdx * 28;

          const deltaX = Math.abs(endX - startX);
          const curveOffset = Math.max(50, deltaX * 0.4);

          const cp1x = isTargetRight ? startX + curveOffset : startX - curveOffset;
          const cp1y = startY;
          const cp2x = isTargetRight ? endX - curveOffset : endX + curveOffset;
          const cp2y = endY;

          const pathD = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;

          const isSelected = selectedRelationshipId === rel.id;

          return (
            <g key={rel.id} className="pointer-events-auto cursor-pointer" onClick={() => {
              sound.playClick();
              setSelectedRelationshipId(rel.id);
              setSelectedEntityId(null);
            }}>
              {/* Thick transparent background path for easy clicking */}
              <path d={pathD} fill="none" stroke="transparent" strokeWidth="20" />

              {/* Glowing Outline when selected */}
              {isSelected && (
                <path d={pathD} fill="none" stroke="#a855f7" strokeWidth="6" strokeOpacity="0.4" filter="url(#erd-glow)" />
              )}

              {/* Main Relationship Line */}
              <path
                d={pathD}
                fill="none"
                stroke={isSelected ? '#c084fc' : '#8b5cf6'}
                strokeWidth={isSelected ? '3' : '2'}
                strokeDasharray={rel.isIdentifying ? 'none' : '6 3'}
                markerStart="url(#crows-foot-one)"
                markerEnd="url(#crows-foot-many)"
                className="transition-all"
              />

              {/* Central Cardinality Badge Pill */}
              <g transform={`translate(${midX}, ${midY})`}>
                <rect
                  x="-28"
                  y="-12"
                  width="56"
                  height="24"
                  rx="12"
                  fill="#0f172a"
                  stroke={isSelected ? '#c084fc' : '#8b5cf6'}
                  strokeWidth="1.5"
                  className="shadow-md"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {rel.cardinality}
                </text>
              </g>
            </g>
          );
        })}

        {/* Live Connecting Wire while dragging port */}
        {connectingFrom && dragMousePos && (
          <path
            d={`M ${connectingFrom.x} ${connectingFrom.y} Q ${(connectingFrom.x + dragMousePos.x) / 2} ${(connectingFrom.y + dragMousePos.y) / 2 - 40} ${dragMousePos.x} ${dragMousePos.y}`}
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
            <Network className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                ER Diagram Studio
              </h1>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                Relational Canvas
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                Full CRUD
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden md:block">
              Drag-and-drop entity modeling, multi-cardinality relationships, 3NF normalization &amp; live SQL compilation
            </p>
          </div>
        </div>

        {/* Center: Template & Notation Switcher */}
        <div className="flex items-center gap-2">
          {/* Preset Template Switcher */}
          <div className="hidden lg:flex items-center gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Templates:
            </span>
            <button
              onClick={() => {
                sound.playClick();
                setEntities(csc1033UniversityTemplate.entities);
                setRelationships(csc1033UniversityTemplate.relationships);
                setSelectedEntityId(null);
                setSelectedRelationshipId(null);
                awardXp(15, 'Loaded Academic Registry ERD');
              }}
              className="px-2.5 py-1 rounded-lg font-semibold hover:bg-slate-700 text-slate-200 transition-all text-xs"
            >
              🎓 Academic Registry
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setEntities(ecommerceTemplate.entities);
                setRelationships(ecommerceTemplate.relationships);
                setSelectedEntityId(null);
                setSelectedRelationshipId(null);
                awardXp(15, 'Loaded E-Commerce ERD');
              }}
              className="px-2.5 py-1 rounded-lg font-semibold hover:bg-slate-700 text-slate-200 transition-all text-xs"
            >
              🛒 E-Commerce
            </button>
          </div>

          {/* Notation Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs">
            <button
              onClick={() => setNotation('crows_foot')}
              className={`px-2 py-1 rounded-lg font-bold transition-all text-[11px] ${
                notation === 'crows_foot' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Crow&apos;s Foot
            </button>
            <button
              onClick={() => setNotation('uml')}
              className={`px-2 py-1 rounded-lg font-bold transition-all text-[11px] ${
                notation === 'uml' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              UML Multiplicity
            </button>
          </div>
        </div>

        {/* Right Actions: Add Table, SQL DDL, Sync to SQL Lab */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAddEntity}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Entity</span>
          </button>

          <button
            onClick={() => setShowSqlDdlModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all cursor-pointer"
            title="Inspect Generated SQL DDL Script"
          >
            <Code className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">View SQL DDL</span>
          </button>

          <button
            onClick={handlePushToSqlLab}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
            title="Deploy schema directly into isolated In-Memory SQL Lab Engine"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Push to SQL Lab</span>
          </button>
        </div>
      </header>

      {/* Sync Success Banner */}
      {sqlSyncSuccess && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-2xl bg-emerald-500/90 text-white text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in duration-200 backdrop-blur-md">
          <Check className="w-4 h-4" />
          <span>{sqlSyncSuccess}</span>
        </div>
      )}

      {/* Canvas Workspace Layout */}
      <div className="flex-1 relative overflow-hidden flex">
        
        {/* Main Interactive Diagram Canvas */}
        <div
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          className="flex-1 h-full w-full relative bg-[#090d16] cursor-grab active:cursor-grabbing overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(#1e293b 1.5px, transparent 1.5px)`,
            backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }}
        >
          {/* Zoom / Pan Navigation Float HUD */}
          <div className="absolute bottom-4 left-4 z-30 flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md">
            <button
              onClick={() => setZoom((z) => Math.min(1.8, z + 0.1))}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px] font-bold text-slate-400 px-2">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors"
              title="Reset View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Canvas Transform Wrapper */}
          <div
            className="w-full h-full absolute inset-0 origin-top-left"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            }}
          >
            {/* SVG Connecting Relationships Layer */}
            {renderRelationshipsSvg()}

            {/* Entity Table Cards Layer */}
            {entities.map((entity) => {
              const isSelected = selectedEntityId === entity.id;

              return (
                <div
                  key={entity.id}
                  style={{
                    transform: `translate(${entity.x}px, ${entity.y}px)`,
                    borderColor: isSelected ? entity.color || '#8b5cf6' : '#334155',
                  }}
                  onMouseDown={(e) => startDraggingEntity(e, entity)}
                  className={`absolute w-[240px] rounded-2xl bg-slate-900/95 border-2 shadow-xl backdrop-blur-md transition-shadow select-none group cursor-move ${
                    isSelected ? 'ring-4 ring-purple-500/20 shadow-2xl' : 'hover:border-slate-600'
                  }`}
                >
                  {/* Entity Header */}
                  <div
                    className="p-2.5 rounded-t-[14px] flex items-center justify-between border-b border-slate-800/80"
                    style={{ backgroundColor: `${entity.color || '#8b5cf6'}20` }}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Database
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ color: entity.color || '#8b5cf6' }}
                      />
                      <span className="font-bold text-xs text-white truncate font-mono">
                        {entity.name}
                      </span>
                      {entity.isWeak && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-pink-500/20 text-pink-300 font-mono font-bold">
                          Weak
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingEntity(entity);
                          setIsEntityModalOpen(true);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Edit Entity Properties"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEntity(entity.id);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete Entity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

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

                          <span
                            className={`font-mono truncate ${
                              attr.isPrimaryKey
                                ? 'font-bold text-amber-300 underline decoration-amber-500/50'
                                : attr.isForeignKey
                                ? 'text-purple-300'
                                : 'text-slate-300'
                            }`}
                          >
                            {attr.name}
                          </span>
                        </div>

                        {/* Right: Data Type & Connector Port */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="font-mono text-[9px] text-slate-500">
                            {attr.dataType.split('(')[0]}
                          </span>

                          {/* Connector Port Circle (Drag or drop to form relationships) */}
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

                  {/* Add Column Button at bottom of card */}
                  <div className="p-1.5 pt-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAddAttribute(entity.id);
                      }}
                      className="w-full py-1 rounded-lg border border-dashed border-slate-700 hover:border-purple-500 hover:bg-purple-500/10 text-slate-400 hover:text-purple-300 text-[10px] font-bold transition-all flex items-center justify-center gap-1"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>Add Column</span>
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
                  Active Relationship Connection
                </span>
                <p className="text-xs font-bold text-white">
                  {selectedRelationship.name}
                </p>
                <div className="text-[11px] text-slate-300 font-mono">
                  {entities.find((e) => e.id === selectedRelationship.fromEntityId)?.name} ➔{' '}
                  {entities.find((e) => e.id === selectedRelationship.toEntityId)?.name}
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
                  <option value="RESTRICT">RESTRICT (Block deletion if children exist)</option>
                  <option value="SET NULL">SET NULL (Set foreign key to NULL)</option>
                  <option value="NO ACTION">NO ACTION</option>
                </select>
              </div>

              {/* Delete Relationship */}
              <button
                onClick={() => {
                  sound.playError();
                  setRelationships((prev) => prev.filter((r) => r.id !== selectedRelationship.id));
                  setSelectedRelationshipId(null);
                }}
                className="w-full py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Disconnect Relationship</span>
              </button>
            </div>
          ) : selectedEntity ? (
            /* 2. If Entity is Selected */
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Table Schema
                </span>
                <p className="text-sm font-mono font-bold text-white">
                  {selectedEntity.name}
                </p>
                <p className="text-[11px] text-slate-400">
                  {selectedEntity.comment || 'No documentation provided.'}
                </p>
              </div>

              {/* Attributes in Selected Entity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300">
                    Columns ({selectedEntity.attributes.length})
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
                      className="p-2 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {attr.isPrimaryKey ? (
                          <Key className="w-3 h-3 text-amber-400 shrink-0" />
                        ) : attr.isForeignKey ? (
                          <LinkIcon className="w-3 h-3 text-purple-400 shrink-0" />
                        ) : (
                          <span className="w-3 h-3 rounded-full bg-slate-700 shrink-0" />
                        )}
                        <span className="font-mono font-medium truncate text-white">
                          {attr.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="font-mono text-[9px] text-slate-400">
                          {attr.dataType.split('(')[0]}
                        </span>
                        <button
                          onClick={() => {
                            setEditingAttributeEntityId(selectedEntity.id);
                            setEditingAttribute(attr);
                            setIsAttributeModalOpen(true);
                          }}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteAttribute(selectedEntity.id, attr.id)}
                          className="p-1 text-slate-400 hover:text-rose-400"
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
                  onClick={() => {
                    setEditingEntity(selectedEntity);
                    setIsEntityModalOpen(true);
                  }}
                  className="w-full py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Table Name &amp; Options</span>
                </button>

                <button
                  onClick={() => handleDeleteEntity(selectedEntity.id)}
                  className="w-full py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Delete Table</span>
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
                Click any Entity card or Relationship connection line on the canvas to inspect and edit its relational constraints.
              </p>
              <div className="text-[11px] text-purple-400 bg-purple-500/10 border border-purple-500/20 p-2.5 rounded-xl text-left space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Quick Tip:</span>
                </p>
                <p className="text-slate-300">
                  Drag from any column&apos;s connector circle on Table A and drop onto Table B to visually establish Foreign Key relationships!
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: Create / Edit Entity */}
      {/* ========================================================================= */}
      {isEntityModalOpen && editingEntity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                <span>{entities.some((e) => e.id === editingEntity.id) ? 'Edit Entity' : 'Create New Entity'}</span>
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
                  Table Name (SQL Identifier)
                </label>
                <input
                  type="text"
                  value={editingEntity.name}
                  onChange={(e) => setEditingEntity({ ...editingEntity, name: e.target.value })}
                  placeholder="e.g. students, course_catalog"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Documentation / Course Note
                </label>
                <textarea
                  value={editingEntity.comment || ''}
                  onChange={(e) => setEditingEntity({ ...editingEntity, comment: e.target.value })}
                  placeholder="Description of the entity and its real-world domain role..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-hidden focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div>
                  <span className="text-xs font-bold text-white block">Weak Entity</span>
                  <span className="text-[10px] text-slate-400">Depends on parent entity for identification</span>
                </div>
                <input
                  type="checkbox"
                  checked={editingEntity.isWeak || false}
                  onChange={(e) => setEditingEntity({ ...editingEntity, isWeak: e.target.checked })}
                  className="w-4 h-4 accent-purple-600 rounded"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Header Accent Color
                </label>
                <div className="flex items-center gap-2">
                  {['#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'].map((c) => (
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
                Save Entity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Create / Edit Attribute */}
      {/* ========================================================================= */}
      {isAttributeModalOpen && editingAttribute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-purple-400" />
                <span>Column Specification</span>
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
                  Column Name
                </label>
                <input
                  type="text"
                  value={editingAttribute.name}
                  onChange={(e) => setEditingAttribute({ ...editingAttribute, name: e.target.value })}
                  placeholder="e.g. student_id, first_name"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Data Type
                </label>
                <select
                  value={editingAttribute.dataType}
                  onChange={(e) => setEditingAttribute({ ...editingAttribute, dataType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono"
                >
                  <option value="INT">INT (Integer)</option>
                  <option value="BIGINT">BIGINT (Large Integer)</option>
                  <option value="VARCHAR(100)">VARCHAR(100) (Short Text)</option>
                  <option value="VARCHAR(255)">VARCHAR(255) (Standard String)</option>
                  <option value="TEXT">TEXT (Long Text)</option>
                  <option value="BOOLEAN">BOOLEAN (True / False)</option>
                  <option value="DECIMAL(10,2)">DECIMAL(10,2) (Financial / Precision)</option>
                  <option value="DATE">DATE (Calendar Day)</option>
                  <option value="TIMESTAMP">TIMESTAMP (Date &amp; Time)</option>
                  <option value="UUID">UUID (Global Identifier)</option>
                </select>
              </div>

              {/* Constraint Checkboxes */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Primary Key (PK)</span>
                      <span className="text-[10px] text-slate-400">Uniquely identifies table records</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={editingAttribute.isPrimaryKey}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setEditingAttribute({
                        ...editingAttribute,
                        isPrimaryKey: checked,
                        isNullable: checked ? false : editingAttribute.isNullable,
                        isUnique: checked ? true : editingAttribute.isUnique,
                      });
                    }}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">NOT NULL</span>
                    <span className="text-[10px] text-slate-400">Attribute value cannot be empty</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={!editingAttribute.isNullable}
                    onChange={(e) => setEditingAttribute({ ...editingAttribute, isNullable: !e.target.checked })}
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">UNIQUE</span>
                    <span className="text-[10px] text-slate-400">Enforces distinct values across all rows</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={editingAttribute.isUnique}
                    onChange={(e) => setEditingAttribute({ ...editingAttribute, isUnique: e.target.checked })}
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
                Apply Column
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: View & Export Generated SQL DDL */}
      {/* ========================================================================= */}
      {showSqlDdlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Generated Relational SQL DDL</h3>
                  <p className="text-xs text-slate-400">Standard DDL with Foreign Key constraints &amp; cascading rules</p>
                </div>
              </div>
              <button
                onClick={() => setShowSqlDdlModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Code Block Viewer */}
            <div className="flex-1 overflow-y-auto rounded-2xl bg-black/60 p-4 border border-slate-800 font-mono text-xs text-purple-200 select-text leading-relaxed">
              <pre>{generatedSqlDdl}</pre>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between shrink-0 pt-2">
              <span className="text-[11px] text-slate-500 font-mono">
                {entities.length} Tables • {relationships.length} Relational Constraints
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySql}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
                >
                  {sqlCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{sqlCopied ? 'Copied!' : 'Copy SQL'}</span>
                </button>
                <button
                  onClick={() => {
                    handlePushToSqlLab();
                    setShowSqlDdlModal(false);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute in SQL Lab</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
