import toml

def read_config():
    with open("config.toml", 'r') as file:
        config = toml.load(file)
    return config

def get_secrets():
    config = read_config()
    secrets = {
        "DROPBOX_ACCESS_TOKEN": config.get("DROPBOX_ACCESS_TOKEN"),
        "SECRET_KEY": config.get("SECRET_KEY"),
        "MODEL": config.get("MODEL")
    }
    return secrets