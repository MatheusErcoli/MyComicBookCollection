import Usuario from "../models/usuario";
import { UsuarioAttributes, UsuarioCreationAttributes } from "../types/usuario.types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default class UsuarioService {

  static async create(data: Omit<UsuarioAttributes, 'id' | 'created_at' | 'updated_at'>) {
    const hashedSenha = await bcrypt.hash(data.senha, 10);
    return await Usuario.create({ ...data, senha: hashedSenha });
  }

  static async findAll(limit: number, offset: number) {
    return await Usuario.findAndCountAll({
      limit,
      offset,
      order: [["created_at", "DESC"]],
      attributes: { exclude: ["senha"] }
    });
  }

  static async findById(id: number) {
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ["senha"] }
    });

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    return usuario;
  }

  static async update(id: number, data: Partial<UsuarioAttributes>) {
    const usuario = await this.findById(id);

    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, 10);
    }

    return await usuario.update(data);
  }

  static async delete(id: number) {
    const usuario = await this.findById(id);
    await usuario.destroy();

    return { message: "Usuário removido com sucesso" };
  }

  static async login(email: string, senha: string) {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new Error("Senha inválida");
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1d"
    });

    return { token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } };
  }
}