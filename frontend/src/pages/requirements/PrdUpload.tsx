import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Upload, Button, message, Spin } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { requirementApi } from '../../api'

const { Dragger } = Upload

const PrdUpload = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    if (!file || !id) { message.error('请选择文件'); return }
    setUploading(true)
    try {
      const res = await requirementApi.upload(id, file) as any
      if (res.code === 0) { message.success('上传成功'); navigate(`/projects/${id}/testpoints`) }
      else message.error(res.message)
    } catch (err) { message.error('上传失败') }
    finally { setUploading(false) }
  }

  const uploadProps = {
    accept: '.pdf,.doc,.docx,.md,.markdown',
    beforeUpload: (f: File) => { setFile(f); return false },
    onRemove: () => { setFile(null); return true },
  }

  return (
    <Card title="上传PRD文档">
      <Dragger {...uploadProps}>
        <p><InboxOutlined style={{ fontSize: 48 }} /></p>
        <p>点击或拖拽文件到此处</p>
        <p>支持 PDF, Word, Markdown</p>
      </Dragger>
      <Button type="primary" onClick={handleUpload} loading={uploading} disabled={!file} style={{ marginTop: 16 }} block>
        {uploading ? '上传解析中...' : '开始上传并解析'}
      </Button>
    </Card>
  )
}

export default PrdUpload
