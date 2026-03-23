class EstadosController < ApplicationController
  def index
    estados = Estado.all
    render json: estados
  end

  def show
    estado = Estado.find(params[:id])
    render json: estado
  end

  def create
    estado = Estado.new(estado_params)

    if estado.save
      render json: estado, status: :created
    else
      render json: { errors: estado.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    estado = Estado.find(params[:id])

    if estado.update(estado_params)
      render json: estado
    else
      render json: { errors: estado.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    estado = Estado.find(params[:id])
    estado.destroy
    head :no_content
  end

  private

  def estado_params
    params.require(:estado).permit(:descricao, :sigla)
  end
end