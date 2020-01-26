from app import create_app, db
from app.models import User

app = create_app()


@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'User': User}


if __name__ == "__main__":
    # import ptvsd
    # address = ('0.0.0.0', 3000)
    # ptvsd.enable_attach(address)
    app.run(host='0.0.0.0', debug=app.config["DEBUG"], port=app.config["PORT"])
