import HQ from "./HQ";
import Usuario from "./usuario";
import HQUsuario from "./hq_usuario";
import HQDesenhista from "./hq_desenhista";
import HQColecao from "./hq_colecao";
import HQAutor from "./hq_autor";
import Editora from "./editora";
import Desenhista from "./desenhista";
import Colecao from "./colecao";
import Autor from "./autor";

export function establishRelations() {
  // --- RELAÇÕES 1:N (Um para Muitos) ---

  // Editora <-> HQ
  Editora.hasMany(HQ, { foreignKey: "editora_id", as: "hq" });
  HQ.belongsTo(Editora, { foreignKey: "editora_id", as: "editora" });


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

  // Usuario <-> HQ (via UsuarioHQ - Coleção Pessoal)
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
}