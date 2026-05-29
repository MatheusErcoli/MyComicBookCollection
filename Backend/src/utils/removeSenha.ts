export function removeSenha(usuario: any) {
  const user = usuario.toJSON();
  delete user.senha;
  return user;
}