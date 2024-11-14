import React, { useState, useEffect } from 'react';
import { Typography, Button, Card, Modal, Form, Input, message, Spin } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axiosInstance from '../components/AxiosInterceptor';

const { Title } = Typography;

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form instance for controlling the form fields
  const [form] = Form.useForm();

  // Fetch notes from API when the component mounts
  useEffect(() => {
    fetchNotes();
  }, []);

  // Function to fetch notes from the API
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/notes/');
      setNotes(response.data); 
    } catch (error) {
      if (error.response && error.response.status === 401) {
        message.error('Unauthorized. Please log in again.'); 
      } else {
        message.error('Failed to fetch notes. Please try again.');
      }
      console.error('Fetch notes error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new note
  const handleAddNote = async (values) => { 
    try {
      const response = await axiosInstance.post('/notes/', values); 
      setNotes([...notes, response.data]);
      setIsModalVisible(false); 
      form.resetFields();
      message.success('Note added successfully!');
    } catch (error) {
      if (error.response && error.response.status === 401) { 
        message.error('Unauthorized. Please log in again.');
      } else {
        message.error('Failed to add note. Please try again.');
      }
      console.error('Add note error:', error);
    }
  };

  // Function to delete a note
  const handleDeleteNote = async (id) => { 
    try {
      // Use the provided delete API endpoint
      await axiosInstance.delete(`/ notes/delete/${id}`); 
      setNotes(notes.filter(note => note.id !== id)); 
      message.success('Note deleted successfully!'); 
    } catch (error) {
      if (error.response && error.response.status === 401) {
        message.error('Unauthorized. Please log in again.');
      } else {
        message.error('Failed to delete note. Please try again.');
      }
      console.error('Delete note error:', error);
    }
  };


  const showAddNoteModal = () => { 
    setIsModalVisible(true);
  };

  const handleCancel = () => { 
    setIsModalVisible(false);
    form.resetFields(); 
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Notes</Title>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showAddNoteModal} 
        style={{ marginBottom: '20px' }}
      >
        Add New Note
      </Button>

      {loading ? ( 
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Spin size="large" />
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {notes.map(note => ( 
            <Card
              key={note.id}
              title={note.title}
              extra={
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteNote(note.id)} 
                  danger
                />
              }
            >
              <p>{note.content}</p>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title="Add New Note"
        visible={isModalVisible}
        onCancel={handleCancel} 
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddNote}> 
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="Note Title" />
          </Form.Item>
          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: 'Please enter the content' }]}
          >
            <Input.TextArea rows={4} placeholder="Note Content" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Note
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Home;
