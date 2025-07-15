import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import Button from './Button'
import { Client, CreateClientRequest } from '../types/client'

interface ClientModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateClientRequest) => void
  client?: Client | null
  isLoading?: boolean
}

const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  client = null,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<CreateClientRequest>({
    name: '',
    salary: 0,
    companyValuation: 0
  })

  // Estados separados para controlar os inputs como strings
  const [salaryInput, setSalaryInput] = useState<string>('')
  const [companyValueInput, setCompanyValueInput] = useState<string>('')

  const [errors, setErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        salary: client.salary,
        companyValuation: client.companyValuation
      })
      setSalaryInput(client.salary.toString())
      setCompanyValueInput(client.companyValuation.toString())
    } else {
      setFormData({
        name: '',
        salary: 0,
        companyValuation: 0
      })
      setSalaryInput('')
      setCompanyValueInput('')
    }
    setErrors({})
  }, [client, isOpen])

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    const salaryValue = parseFloat(salaryInput) || 0
    if (salaryValue <= 0) {
      newErrors.salary = 'Salário deve ser maior que zero'
    }

    const companyValue = parseFloat(companyValueInput) || 0
    if (companyValue <= 0) {
      newErrors.companyValuation = 'Valor da empresa deve ser maior que zero'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      const submitData = {
        ...formData,
        salary: parseFloat(salaryInput) || 0,
        companyValuation: parseFloat(companyValueInput) || 0
      }
      onSubmit(submitData)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      salary: 0,
      companyValuation: 0
    })
    setSalaryInput('')
    setCompanyValueInput('')
    setErrors({})
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={client ? 'Editar cliente' : 'Criar cliente'}
      size="medium"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#4a5568',
            fontSize: '0.9rem'
          }}>
            Nome completo *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Digite o nome completo"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: errors.name ? '1px solid #e53e3e' : '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.9rem',
              backgroundColor: 'white',
              boxSizing: 'border-box'
            }}
          />
          {errors.name && (
            <div style={{
              color: '#e53e3e',
              fontSize: '0.8rem',
              marginTop: '0.25rem'
            }}>
              {errors.name}
            </div>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#4a5568',
              fontSize: '0.9rem'
            }}>
              Salário (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={salaryInput}
              onChange={(e) => setSalaryInput(e.target.value)}
              onFocus={(e) => {
                e.target.select();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && salaryInput === '0') {
                  setSalaryInput('');
                }
              }}
              placeholder="Digite o salário"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.salary ? '1px solid #e53e3e' : '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                backgroundColor: 'white',
                boxSizing: 'border-box'
              }}
            />
            {errors.salary && (
              <div style={{
                color: '#e53e3e',
                fontSize: '0.8rem',
                marginTop: '0.25rem'
              }}>
                {errors.salary}
              </div>
            )}
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#4a5568',
              fontSize: '0.9rem'
            }}>
              Valor da empresa (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={companyValueInput}
              onChange={(e) => setCompanyValueInput(e.target.value)}
              onFocus={(e) => {
                e.target.select();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && companyValueInput === '0') {
                  setCompanyValueInput('');
                }
              }}
              placeholder="Digite o valor da empresa"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.companyValuation ? '1px solid #e53e3e' : '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                backgroundColor: 'white',
                boxSizing: 'border-box'
              }}
            />
            {errors.companyValuation && (
              <div style={{
                color: '#e53e3e',
                fontSize: '0.8rem',
                marginTop: '0.25rem'
              }}>
                {errors.companyValuation}
              </div>
            )}
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end',
          marginTop: '2rem'
        }}>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            variant={client ? 'warning' : 'primary'}
            loading={isLoading}
            disabled={isLoading}
          >
            {client ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default ClientModal
