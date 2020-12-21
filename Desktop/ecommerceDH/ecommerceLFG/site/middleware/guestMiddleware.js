//middleware no deja entrar a paginas donde debes estar registrado y enviará a pagina de invitado

function guestMiddleware (req,res,next){

    if (req.session.usuarioLogueado == undefined) {
      next();
    } else {
      res.redirect("/user/profile"); //DEBERIAMOS LLEVAR A PAGINA GUEST
    }
    
}

module.exports = guestMiddleware