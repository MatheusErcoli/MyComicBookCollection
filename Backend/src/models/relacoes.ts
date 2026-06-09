import HQ from "./hq";
import Usuario from "./usuario";
import HQUsuario from "./hq_usuario";
import HQDesenhista from "./hq_desenhista";
import HQColecao from "./hq_colecao";
import HQAutor from "./hq_autor";
import HQVolume from "./hq_volume";
import Editora from "./editora";
import Desenhista from "./desenhista";
import Colecao from "./colecao";
import Autor from "./autor";
import Volume from "./volume";

export function establishRelations() {
  // --- RELAÇÕES 1:N (Um para Muitos) ---

  // Editora <-> HQ
  Editora.hasMany(HQ, {
    foreignKey: "editora_id",
    as: "hq"
  });

  HQ.belongsTo(Editora, {
    foreignKey: "editora_id",
    as: "editora"
  });

  // --- RELAÇÕES N:M (Muitos para Muitos) ---

  // HQ <-> Autor (via HQAutor)
  HQ.belongsToMany(Autor, {
    through: HQAutor,
    foreignKey: "hq_id",
    otherKey: "autor_id",
    as: "autor"
  });

  Autor.belongsToMany(HQ, {
    through: HQAutor,
    foreignKey: "autor_id",
    otherKey: "hq_id",
    as: "hq"
  });

  // HQ <-> Desenhista (via HQDesenhista)
  HQ.belongsToMany(Desenhista, {
    through: HQDesenhista,
    foreignKey: "hq_id",
    otherKey: "desenhista_id",
    as: "desenhista"
  });

  Desenhista.belongsToMany(HQ, {
    through: HQDesenhista,
    foreignKey: "desenhista_id",
    otherKey: "hq_id",
    as: "hq"
  });

  // HQ <-> Colecao (via HQColecao)
  HQ.belongsToMany(Colecao, {
    through: HQColecao,
    foreignKey: "hq_id",
    otherKey: "colecao_id",
    as: "colecao"
  });

  Colecao.belongsToMany(HQ, {
    through: HQColecao,
    foreignKey: "colecao_id",
    otherKey: "hq_id",
    as: "hq"
  });

  // HQ <-> Volume (via HQVolume)
  HQ.belongsToMany(Volume, {
    through: HQVolume,
    foreignKey: "hq_id",
    otherKey: "volume_id",
    as: "volumes"
  });

  Volume.belongsToMany(HQ, {
    through: HQVolume,
    foreignKey: "volume_id",
    otherKey: "hq_id",
    as: "hqs"
  });

  // Usuario <-> HQ (via HQUsuario - Coleção Pessoal)
  Usuario.belongsToMany(HQ, {
    through: HQUsuario,
    foreignKey: "usuario_id",
    otherKey: "hq_id",
    as: "minha_colecao"
  });

  HQ.belongsToMany(Usuario, {
    through: HQUsuario,
    foreignKey: "hq_id",
    otherKey: "usuario_id",
    as: "colecionadores"
  });

  // --- RELAÇÕES DAS TABELAS INTERMEDIÁRIAS ---

  HQAutor.belongsTo(HQ, {
    foreignKey: "hq_id",
    as: "hq"
  });

  HQAutor.belongsTo(Autor, {
    foreignKey: "autor_id",
    as: "autor"
  });

  HQColecao.belongsTo(HQ, {
    foreignKey: "hq_id",
    as: "hq"
  });

  HQColecao.belongsTo(Colecao, {
    foreignKey: "colecao_id",
    as: "colecao"
  });

  HQDesenhista.belongsTo(HQ, {
    foreignKey: "hq_id",
    as: "hq"
  });

  HQDesenhista.belongsTo(Desenhista, {
    foreignKey: "desenhista_id",
    as: "desenhista"
  });

  HQUsuario.belongsTo(HQ, {
    foreignKey: "hq_id",
    as: "hq"
  });

  HQUsuario.belongsTo(Usuario, {
    foreignKey: "usuario_id",
    as: "usuario"
  });

  HQVolume.belongsTo(HQ, {
    foreignKey: "hq_id",
    as: "hq"
  });

  HQVolume.belongsTo(Volume, {
    foreignKey: "volume_id",
    as: "volume"
  });

  // --- HAS MANY DAS TABELAS INTERMEDIÁRIAS ---

  HQ.hasMany(HQAutor, {
    foreignKey: "hq_id",
    as: "hq_autores"
  });

  HQ.hasMany(HQDesenhista, {
    foreignKey: "hq_id",
    as: "hq_desenhistas"
  });

  HQ.hasMany(HQColecao, {
    foreignKey: "hq_id",
    as: "hq_colecoes"
  });

  HQ.hasMany(HQUsuario, {
    foreignKey: "hq_id",
    as: "hq_usuarios"
  });

  HQ.hasMany(HQVolume, {
    foreignKey: "hq_id",
    as: "hq_volumes"
  });

  Volume.hasMany(HQVolume, {
    foreignKey: "volume_id",
    as: "hq_volumes"
  });
}