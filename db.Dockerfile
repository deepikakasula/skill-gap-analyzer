FROM mysql:8.0

# Install python3 to run a simple health check server
RUN apt-get update && apt-get install -y python3 && rm -rf /var/lib/apt/lists/*

# Copy the custom entrypoint script
COPY db-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/db-entrypoint.sh

# Run our custom entrypoint script
ENTRYPOINT ["db-entrypoint.sh"]
CMD ["mysqld"]
