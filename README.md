# login_interview_question

# script
```
cd api
# pull mongo image
docker pull mongo
# docker up server
# run auth.spec.js and show 5 test results as api log
# log includes mongo log and api log
docker compose up
```





----------------------------------------
this project has two Schema:

```
UserSchema: username, password, is_locked

UserLoginFailAttampts: username, login_fail_timestamp, login_fail_count
```

# API
## Register
```
/api/auth/register
```
Request:
| field | description | type | required | 
| --- | --- |  ---  |  ---  | 
| username | username | string |  Y |
| password | password | string |  Y |

Response:
| field | description | type | required | 
| --- | --- |  ---  |  ---  | 
| status | status code | int | Y |
| message | register message | string | N |

## Login
```
/api/auth/login
```
Request:
| field | description | type | required | 
| --- | --- |  ---  |  ---  | 
| username | username | string | Y |
| password | password | string | Y |

Response:
| field | description | type | required | 
| --- | --- |  ---  |  ---  | 
| status | status code | int | Y |
| message | register message | string | Y |
| jwt | jwt token | string | Y |

## Reset
```
/api/auth/reset
```
Request:
| field | description | type | required | 
| --- | --- |  ---  |  ---  | 
| username | username | string | Y |

Response:
| field | description | type | required | 
| --- | --- |  ---  |  ---  | 
| status | status code | int | Y |
| message | register message | string | Y |

# Test
test 1: register user
        register a user for testing purpose
```
/api/auth/register, params:{username: "test", password: "123456"}
```

test 2: reset user before test
```
/api/auth/reset,  params:{username: "test"}
```

test 3: user login successful
```
/api/auth/login, params:{username: "test", password: "123456"}
```

test 4: user login unsuccessful
```
/api/auth/login, params:{username: "test", password: "12345677"}
```

test 5: user login unsuccessful 3 times within 5 mins, lock user
```
/api/auth/login， params:{username: "test", password: "12345677"}
```
If user login password doesn't match the database record, In UserLoginFailAttampts, insert username and timestamp, and set login_fail_count = 1.

Next time if login unsuccessful again, update login_fail_count = login_fail_count +1. if the login_fail_count greater than 3, locked user by update User schema, set is_locked = true.

If successful login, remove UserLoginFailAttampts record.

If use reset API, remove UserLoginFailAttampts record and set User.is_locked = false.