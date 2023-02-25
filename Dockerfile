FROM public.ecr.aws/lambda/provided:al2

# Copy custom runtime bootstrap
COPY bootstrap ${LAMBDA_RUNTIME_DIR}
RUN chmod +x ${LAMBDA_RUNTIME_DIR}/bootstrap

RUN yum update -y
RUN yum install jq -y
RUN yum install git -y
RUN git clone https://github.com/DavidGriffith/frotz.git
RUN yum install make -y
RUN yum install gcc -y
RUN cd frotz &&\
    echo $(pwd) &&\
    make install_dumb
RUN curl https://eblong.com/infocom/gamefiles/zork1-r119-s880429.z3 -o zork1.z3

# Copy function code
COPY test.sh ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "test.handler" ] 