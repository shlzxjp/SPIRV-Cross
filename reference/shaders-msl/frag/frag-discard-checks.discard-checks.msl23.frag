#pragma clang diagnostic ignored "-Wunused-variable"
#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>
#include <metal_atomic>

using namespace metal;

// The required alignment of a linear texture of R32Uint format.
constant uint spvLinearTextureAlignmentOverride [[function_constant(65535)]];
constant uint spvLinearTextureAlignment = is_function_constant_defined(spvLinearTextureAlignmentOverride) ? spvLinearTextureAlignmentOverride : 4;
// Returns buffer coords corresponding to 2D texture coords for emulating 2D texture atomics
#define spvImage2DAtomicCoord(tc, tex) (((((tex).get_width() +  spvLinearTextureAlignment / 4 - 1) & ~( spvLinearTextureAlignment / 4 - 1)) * (tc).y) + (tc).x)

struct foo_t
{
    float x;
    uint y;
};

struct main0_out
{
    float4 fragColor [[color(0)]];
};

static inline __attribute__((always_inline))
float4 frag_body(device foo_t& foo, thread float4& gl_FragCoord, texture2d<uint, access::write> bar, device atomic_uint* bar_atomic, thread bool& gl_HelperInvocation)
{
    if (!gl_HelperInvocation)
    {
        foo.x = 1.0;
    }
    uint _25 = (!gl_HelperInvocation ? atomic_exchange_explicit((device atomic_uint*)&foo.y, 0u, memory_order_relaxed) : uint{});
    if (int(gl_FragCoord.x) == 3)
    {
        gl_HelperInvocation = true, discard_fragment();
    }
    (gl_HelperInvocation ? ((void)0) : bar.write(uint4(1u), uint2(int2(gl_FragCoord.xy))));
    uint _51 = (!gl_HelperInvocation ? atomic_fetch_add_explicit((device atomic_uint*)&foo.y, 42u, memory_order_relaxed) : uint{});
    uint _58 = (!gl_HelperInvocation ? atomic_fetch_or_explicit((device atomic_uint*)&bar_atomic[spvImage2DAtomicCoord(int2(gl_FragCoord.xy), bar)], 62u, memory_order_relaxed) : uint{});
    uint _61 = (!gl_HelperInvocation ? atomic_fetch_and_explicit((device atomic_uint*)&foo.y, 65535u, memory_order_relaxed) : uint{});
    uint _64 = (!gl_HelperInvocation ? atomic_fetch_xor_explicit((device atomic_uint*)&foo.y, 4294967040u, memory_order_relaxed) : uint{});
    uint _66 = (!gl_HelperInvocation ? atomic_fetch_min_explicit((device atomic_uint*)&foo.y, 1u, memory_order_relaxed) : uint{});
    uint _72 = (!gl_HelperInvocation ? atomic_fetch_max_explicit((device atomic_uint*)&bar_atomic[spvImage2DAtomicCoord(int2(gl_FragCoord.xy), bar)], 100u, memory_order_relaxed) : uint{});
    uint _77;
    if (!gl_HelperInvocation)
    {
        do
        {
            _77 = 100u;
        } while (!atomic_compare_exchange_weak_explicit((device atomic_uint*)&bar_atomic[spvImage2DAtomicCoord(int2(gl_FragCoord.xy), bar)], &_77, 42u, memory_order_relaxed, memory_order_relaxed) && _77 == 100u);
    }
    else
    {
        _77 = {};
    }
    return float4(1.0, 0.0, 0.0, 1.0);
}

fragment main0_out main0(device foo_t& foo [[buffer(0)]], texture2d<uint, access::write> bar [[texture(0)]], device atomic_uint* bar_atomic [[buffer(1)]], float4 gl_FragCoord [[position]])
{
    main0_out out = {};
    bool gl_HelperInvocation = {};
    gl_HelperInvocation = simd_is_helper_thread();
    float4 _84 = frag_body(foo, gl_FragCoord, bar, bar_atomic, gl_HelperInvocation);
    out.fragColor = _84;
    return out;
}

