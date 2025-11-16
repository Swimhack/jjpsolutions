FROM nginx:alpine

# Copy website files to nginx html directory
COPY *.html /usr/share/nginx/html/
COPY *.css /usr/share/nginx/html/

# Expose port 8080
EXPOSE 8080

# Configure nginx to listen on port 8080
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
