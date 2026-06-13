// @ts-nocheck
import React from 'react'
import { AutoSizer, List, type ListRowProps } from 'react-virtualized'
import { Table } from 'antd'
import type { TableProps, ColumnsType } from 'antd'

interface VirtualTableProps<T> extends TableProps<T> {
  scrollY: number
  rowHeight: number
}

export default function VirtualTable<T extends Record<string, unknown>>({
  columns,
  dataSource,
  scrollY,
  rowHeight = 48,
  ...rest
}: VirtualTableProps<T>) {
  const rowCount = dataSource?.length ?? 0

  const rowRenderer = ({ index, key, style }: ListRowProps) => {
    const row = dataSource![index]
    return (
      <div key={key} style={style}>
        <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
          {(columns as ColumnsType<T>)?.map((col: any) => (
            <div
              key={String(col.key ?? col.dataIndex)}
              style={{
                flex: typeof col.width === 'number' ? `0 0 ${col.width}px` : 1,
                padding: '12px 16px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {col.render
                ? col.render((row as Record<string, unknown>)[col.dataIndex as string], row, index)
                : String((row as Record<string, unknown>)[col.dataIndex as string] ?? '')}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: scrollY, overflow: 'hidden' }}>
      <div style={{ display: 'flex', borderBottom: '2px solid #f0f0f0', fontWeight: 600 }}>
        {(columns as ColumnsType<T>)?.map((col: any) => (
          <div
            key={String(col.key ?? col.dataIndex)}
            style={{
              flex: typeof col.width === 'number' ? `0 0 ${col.width}px` : 1,
              padding: '12px 16px',
            }}
          >
            {col.title as any}
          </div>
        ))}
      </div>
      <AutoSizer>
        {({ width }: any) => (
          <List
            width={width}
            height={scrollY - 40}
            rowCount={rowCount}
            rowHeight={rowHeight}
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
    </div>
  )
}
