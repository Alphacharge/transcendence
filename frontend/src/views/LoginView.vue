<template>
  <div>
    <h1>This is the login frontend</h1>
  </div>
  <form class="mx-auto w-50">
    <div class="mb-3">
      <label for="InputEmail" class="form-label">Email address</label>
      <input
        type="email"
        class="form-control"
        id="InputEmail"
        aria-describedby="email"
      />
    </div>
    <div class="mb-3">
      <label for="InputPassword" class="form-label">Password</label>
      <input type="password" class="form-control" id="InputPassword" />
    </div>
    <div class="mb-3 link-secondary">
      Or
      <router-link to="/signup">Signup</router-link>
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
</template>
